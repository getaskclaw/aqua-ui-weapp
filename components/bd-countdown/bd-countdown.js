'use strict'

function formatTime(total) {
  const safe = Math.max(0, total)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor(safe % 3600 / 60)
  const seconds = safe % 60
  const pad = (value) => String(value).padStart(2, '0')
  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
}

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    seconds: { type: Number, value: 0 },
    autoplay: { type: Boolean, value: true },
    showHours: { type: Boolean, value: true }
  },
  data: { remain: 0, display: formatTime(0) },
  observers: {
    seconds(value) {
      this.setData({ remain: Math.max(0, value), display: formatTime(value) })
      this._restart()
    }
  },
  lifetimes: {
    detached() { this._clear() }
  },
  methods: {
    _restart() {
      this._clear()
      if (!this.data.autoplay || this.data.remain <= 0) return
      this._timer = setInterval(() => {
        const remain = Math.max(0, this.data.remain - 1)
        this.setData({ remain, display: formatTime(remain) })
        this.triggerEvent('change', { remain })
        if (remain === 0) {
          this._clear()
          this.triggerEvent('finish')
        }
      }, 1000)
    },
    _clear() {
      if (this._timer) clearInterval(this._timer)
      this._timer = null
    }
  }
})
