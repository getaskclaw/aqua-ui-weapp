'use strict'

const OVERLAY_MS = 240

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    visible: { type: Boolean, value: false },
    reducedMotion: { type: Boolean, value: false },
    title: { type: String, value: '' },
    actions: { type: Array, value: [] },
    cancelText: { type: String, value: '取消' },
    closeOnMask: { type: Boolean, value: true }
  },
  data: { presented: false, motionState: 'closed' },
  observers: {
    'visible, reducedMotion': function (visible) {
      if (this._attached) this._syncPresentation(Boolean(visible))
    }
  },
  lifetimes: {
    attached() {
      this._attached = true
      this._syncPresentation(Boolean(this.data.visible))
    },
    detached() {
      this._attached = false
      this._clearMotionTimer()
    }
  },
  methods: {
    _clearMotionTimer() {
      if (!this._motionTimer) return
      clearTimeout(this._motionTimer)
      this._motionTimer = null
    },
    _syncPresentation(visible) {
      this._clearMotionTimer()
      if (visible) {
        if (this.data.presented) {
          this.setData({ motionState: 'open' })
          return
        }
        this.setData({ presented: true, motionState: 'entering' }, () => {
          wx.nextTick(() => {
            if (this._attached && this.data.visible) this.setData({ motionState: 'open' })
          })
        })
        return
      }
      if (!this.data.presented) return
      if (this.data.reducedMotion) {
        this.setData({ presented: false, motionState: 'closed' })
        return
      }
      this.setData({ motionState: 'closing' })
      this._motionTimer = setTimeout(() => {
        this._motionTimer = null
        if (this._attached && !this.data.visible) this.setData({ presented: false, motionState: 'closed' })
      }, OVERLAY_MS)
    },
    mask() { if (this.data.closeOnMask) this.cancel() },
    stop() {},
    cancel() { this.triggerEvent('cancel') },
    choose(event) {
      const index = Number(event.currentTarget.dataset.index)
      const action = this.data.actions[index]
      if (!action || action.disabled) return
      this.triggerEvent('select', { index, action })
    }
  }
})
