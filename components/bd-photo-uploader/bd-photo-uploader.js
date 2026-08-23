// Premium 3x3 photo picker: choose, compress, persist, preview, and remove.
// Limits are kept in the pure, testable utils/photo-uploader.js module.
'use strict'

const {
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  remainingSlots,
  canAdd,
  countText,
  mergePhotos,
  removeAt,
  needsCompression,
  oversizeToast
} = require('../../utils/photo-uploader')

Component({
  properties: {
    photos: { type: Array, value: [] },
    max: { type: Number, value: MAX_PHOTOS },
    disabled: { type: Boolean, value: false },
    reducedMotion: { type: Boolean, value: false }
  },

  data: {
    canAddPhotos: true,
    countLabel: '0/9',
    busy: false
  },

  observers: {
    'photos, max': function (photos, max) {
      this.setData({
        canAddPhotos: canAdd(photos.length, max),
        countLabel: countText(photos.length, max)
      })
    }
  },

  methods: {
    addPhotos() {
      if (this.data.disabled || this.data.busy) return
      const slots = remainingSlots(this.data.photos.length, this.data.max)
      if (slots <= 0) return
      this.setData({ busy: true })
      wx.chooseMedia({
        count: slots,
        mediaType: ['image'],
        sizeType: ['compressed'], // 微信侧先压一轮,绝大多数照片直接落到限内
        sourceType: ['camera', 'album'],
        success: async (result) => {
          const fs = wx.getFileSystemManager()
          const saved = []
          let oversized = 0
          try {
            for (const file of result.tempFiles) {
              const usable = await this.fitUnderLimit(file.tempFilePath, file.size)
              if (!usable) {
                oversized += 1
                continue
              }
              try {
                const target = `${wx.env.USER_DATA_PATH}/aqua-ui-${Date.now()}-${saved.length}.img`
                fs.copyFileSync(usable, target)
                saved.push(target)
              } catch (error) {
                saved.push(usable)
              }
            }
            const merged = mergePhotos(this.data.photos, saved, this.data.max)
            this._emit(merged.photos)
            const dropped = oversized + merged.overflow
            if (dropped) wx.showToast({ title: oversizeToast(dropped), icon: 'none', duration: 2500 })
          } finally {
            this.setData({ busy: false })
          }
        },
        fail: () => this.setData({ busy: false })
      })
    },

    // 超 10 MiB 先压缩再复检;仍超限返回 null,由调用方跳过并提示。
    fitUnderLimit(path, size) {
      if (!needsCompression(size, MAX_PHOTO_BYTES)) return Promise.resolve(path)
      return new Promise((resolve) => {
        wx.compressImage({
          src: path,
          quality: 60,
          success: (compressed) => {
            wx.getFileSystemManager().getFileInfo({
              filePath: compressed.tempFilePath,
              success: (info) =>
                resolve(info.size <= MAX_PHOTO_BYTES ? compressed.tempFilePath : null),
              fail: () => resolve(null)
            })
          },
          fail: () => resolve(null)
        })
      })
    },

    removePhoto(event) {
      if (this.data.disabled) return
      const index = Number(event.currentTarget.dataset.index)
      const removed = this.data.photos[index]
      this._emit(removeAt(this.data.photos, index))
      // Only clean up files created and owned by this component.
      if (removed && removed.indexOf(`${wx.env.USER_DATA_PATH}/aqua-ui-`) === 0) {
        wx.getFileSystemManager().unlink({ filePath: removed, fail: () => {} })
      }
    },

    preview(event) {
      const index = Number(event.currentTarget.dataset.index)
      wx.previewImage({ current: this.data.photos[index], urls: this.data.photos })
    },

    _emit(photos) {
      this.setData({ photos })
      this.triggerEvent('change', { photos })
    }
  }
})
