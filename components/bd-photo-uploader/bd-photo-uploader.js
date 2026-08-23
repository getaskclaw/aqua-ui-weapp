// bd-photo-uploader:虚线框 + camera 图标 + 计数提示 + 九宫格预览 + 删除。
// 内核由 pages/report 上传逻辑迁移而来:wx.chooseMedia 选图 → 超 10 MiB
// 先压缩复检 → 临时文件持久化到用户目录(离线草稿重启可续传)。
// 计数/上限纯逻辑在 utils/photo-uploader.js(node 可测),本组件只做胶水。
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
    disabled: { type: Boolean, value: false }
  },

  data: {
    canAddPhotos: true,
    countLabel: '0/9'
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
      if (this.data.disabled) return
      const slots = remainingSlots(this.data.photos.length, this.data.max)
      if (slots <= 0) return
      wx.chooseMedia({
        count: slots,
        mediaType: ['image'],
        sizeType: ['compressed'], // 微信侧先压一轮,绝大多数照片直接落到限内
        sourceType: ['camera', 'album'],
        success: async (result) => {
          const fs = wx.getFileSystemManager()
          const saved = []
          let oversized = 0
          for (const file of result.tempFiles) {
            const usable = await this.fitUnderLimit(file.tempFilePath, file.size)
            if (!usable) {
              oversized += 1
              continue
            }
            try {
              const target = `${wx.env.USER_DATA_PATH}/report-${Date.now()}-${saved.length}.img`
              fs.copyFileSync(usable, target)
              saved.push(target)
            } catch (error) {
              saved.push(usable)
            }
          }
          // 兜底裁剪到上限(并发/异常路径绝不静默突破)
          const merged = mergePhotos(this.data.photos, saved, this.data.max)
          this._emit(merged.photos)
          const dropped = oversized + merged.overflow
          if (dropped) {
            wx.showToast({ title: oversizeToast(dropped), icon: 'none', duration: 2500 })
          }
        }
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
      this._emit(removeAt(this.data.photos, index))
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
