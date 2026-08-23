'use strict'

function normalizeSeconds(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0
}

function formatTime(total, showHours) {
  const safe = normalizeSeconds(total)
  const hours = Math.floor(safe / 3600)
  const minutes = showHours ? Math.floor(safe % 3600 / 60) : Math.floor(safe / 60)
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
  data: { remain: 0, display: formatTime(0, true) },
  observers: {
    'seconds, autoplay, showHours': function (seconds, autoplay, showHours) {
      if (this._attached) this._syncInputs(seconds, Boolean(autoplay), Boolean(showHours))
    }
  },
  lifetimes: {
    attached() {
      this._attached = true
      this._syncInputs(this.data.seconds, Boolean(this.data.autoplay), Boolean(this.data.showHours))
    },
    detached() {
      this._attached = false
      this._clear()
    }
  },
  pageLifetimes: {
    hide() { this._clear() },
    show() {
      if (!this._attached || !this.data.autoplay) return
      this._renderNow()
      this._startScheduler()
    }
  },
  methods: {
    _syncInputs(seconds, autoplay, showHours) {
      const normalized = normalizeSeconds(seconds)
      const secondsChanged = normalized !== this._sourceSeconds
      const autoplayChanged = autoplay !== this._sourceAutoplay
      const hoursChanged = showHours !== this._sourceShowHours
      if (!secondsChanged && !autoplayChanged && !hoursChanged) return

      if (!secondsChanged && this._sourceAutoplay && this._deadline) this._renderNow(true)
      const previousDeadline = this._deadline
      this._sourceSeconds = normalized
      this._sourceAutoplay = autoplay
      this._sourceShowHours = showHours
      this._clear()

      const remain = secondsChanged ? normalized : this.data.remain
      this.setData({ remain, display: formatTime(remain, showHours) })
      this._deadline = autoplay && remain > 0
        ? (!secondsChanged && !autoplayChanged && previousDeadline ? previousDeadline : Date.now() + remain * 1000)
        : null
      this._finishedDeadline = null
      if (autoplay) this._startScheduler()
    },
    _startScheduler() {
      this._clear()
      if (!this._attached || !this.data.autoplay || !this._deadline || this.data.remain <= 0) return
      this._timer = setInterval(() => this._renderNow(), 1000)
    },
    _renderNow(ignoreAutoplay) {
      if (!this._deadline || (!ignoreAutoplay && !this.data.autoplay)) return
      const deadline = this._deadline
      const remain = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      if (remain !== this.data.remain) {
        this.setData({ remain, display: formatTime(remain, this.data.showHours) })
        this.triggerEvent('change', { remain })
      }
      if (remain === 0) {
        this._clear()
        if (this._finishedDeadline !== deadline) {
          this._finishedDeadline = deadline
          this.triggerEvent('finish')
        }
      }
    },
    _clear() {
      if (this._timer) clearInterval(this._timer)
      this._timer = null
    }
  }
})
