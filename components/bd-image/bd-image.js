'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    src: { type: String, value: '' },
    alt: { type: String, value: '图片' },
    mode: { type: String, value: 'aspectFill' },
    width: { type: String, value: '100%' },
    height: { type: String, value: '320rpx' },
    radius: { type: Number, value: 28 },
    lazyLoad: { type: Boolean, value: true },
    showLoading: { type: Boolean, value: true }
  },
  data: { renderedSrc: '', loading: false, failed: false },
  observers: {
    src(value) {
      this.setData({ renderedSrc: '', loading: Boolean(value), failed: false }, () => {
        if (!value) return
        wx.nextTick(() => {
          if (this.data.src === value) this.setData({ renderedSrc: value })
        })
      })
    }
  },
  methods: {
    loaded(event) {
      if (event.currentTarget.dataset.src !== this.data.renderedSrc) return
      this.setData({ loading: false, failed: false })
      this.triggerEvent('load', event.detail)
    },
    failed(event) {
      if (event.currentTarget.dataset.src !== this.data.renderedSrc) return
      this.setData({ loading: false, failed: true })
      this.triggerEvent('error', event.detail)
    },
    tap() { this.triggerEvent('tap', { src: this.data.src }) }
  }
})
