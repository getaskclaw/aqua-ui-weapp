'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    current: { type: Number, value: 1 },
    total: { type: Number, value: 1 },
    simple: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    previous() { this._change(this.data.current - 1) },
    next() { this._change(this.data.current + 1) },
    _change(value) {
      if (this.data.disabled || value < 1 || value > this.data.total || value === this.data.current) return
      this.setData({ current: value })
      this.triggerEvent('change', { current: value })
    }
  }
})
