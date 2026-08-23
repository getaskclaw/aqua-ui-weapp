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
  oversizeToast,
  persistenceToast,
  mapWithConcurrency
} = require('../../utils/photo-uploader')

const PERSIST_CONCURRENCY = 2
let fileSequence = 0

function extensionFor(path) {
  const match = String(path || '').match(/\.([a-zA-Z0-9]{1,5})(?:[?#].*)?$/)
  return match ? `.${match[1].toLowerCase()}` : '.jpg'
}

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

  lifetimes: {
    attached() { this._attached = true },
    detached() { this._attached = false }
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
          try {
            const outcomes = await mapWithConcurrency(result.tempFiles || [], PERSIST_CONCURRENCY, async (file) => {
              const usable = await this.fitUnderLimit(file.tempFilePath, file.size)
              if (!usable) return { status: 'oversized' }
              const target = `${wx.env.USER_DATA_PATH}/aqua-ui-${Date.now()}-${fileSequence++}${extensionFor(usable)}`
              try {
                await this.persistFile(fs, usable, target)
                return { status: 'saved', path: target }
              } catch (error) {
                return { status: 'failed', error }
              }
            })
            const saved = outcomes.filter((item) => item.status === 'saved').map((item) => item.path)
            const oversized = outcomes.filter((item) => item.status === 'oversized').length
            const failed = outcomes.filter((item) => item.status === 'failed').length

            if (!this._attached) {
              this.cleanupFiles(fs, saved)
              return
            }
            const merged = mergePhotos(this.data.photos, saved, this.data.max)
            const unused = saved.filter((path) => merged.photos.indexOf(path) < 0)
            if (unused.length) this.cleanupFiles(fs, unused)
            this._emit(merged.photos)
            const dropped = oversized + merged.overflow
            if (dropped) wx.showToast({ title: oversizeToast(dropped), icon: 'none', duration: 2500 })
            if (failed) {
              wx.showToast({ title: persistenceToast(failed), icon: 'none', duration: 2500 })
              this.triggerEvent('error', { stage: 'persist', count: failed })
            }
          } finally {
            if (this._attached) this.setData({ busy: false })
          }
        },
        fail: () => { if (this._attached) this.setData({ busy: false }) }
      })
    },

    persistFile(fs, srcPath, destPath) {
      return new Promise((resolve, reject) => {
        fs.copyFile({ srcPath, destPath, success: resolve, fail: reject })
      })
    },

    cleanupFiles(fs, paths) {
      paths.forEach((filePath) => fs.unlink({ filePath, fail: () => {} }))
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
