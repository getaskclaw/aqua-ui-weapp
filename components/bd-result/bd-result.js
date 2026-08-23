'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    status: { type: String, value: 'success' },
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    actionText: { type: String, value: '' },
    reducedMotion: { type: Boolean, value: false }
  },
  data: {
    icon: 'check',
    resultEntering: false
  },
  observers: {
    status(value) {
      const icons = { success: 'check', warning: 'warn', error: 'warn', empty: 'empty-doc' }
      this.setData({ icon: icons[value] || 'check' })
      if (this._ready) this._replayEntry()
    },
    reducedMotion(value) {
      if (value && this.data.resultEntering) this.setData({ resultEntering: false })
    }
  },
  lifetimes: {
    ready() {
      this._ready = true
      this._replayEntry()
    },
    detached() {
      this._ready = false
    }
  },
  methods: {
    _replayEntry() {
      if (this.data.reducedMotion) {
        if (this.data.resultEntering) this.setData({ resultEntering: false })
        return
      }
      this.setData({ resultEntering: false }, () => {
        wx.nextTick(() => {
          if (this._ready && !this.data.reducedMotion) this.setData({ resultEntering: true })
        })
      })
    },
    action() { this.triggerEvent('action') }
  }
})
