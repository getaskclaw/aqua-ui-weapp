'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    value: { type: Number, value: 0 },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 99 },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    minus() { this._change(this.data.value - this.data.step) },
    plus() { this._change(this.data.value + this.data.step) },
    _change(next) {
      if (this.data.disabled) return
      const value = Math.max(this.data.min, Math.min(this.data.max, next))
      if (value === this.data.value) return
      this.setData({ value })
      this.triggerEvent('change', { value })
    }
  }
})
