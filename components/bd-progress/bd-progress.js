'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    value: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    showValue: { type: Boolean, value: true },
    label: { type: String, value: '' },
    semantic: { type: String, value: 'primary' },
    size: { type: String, value: 'normal' }
  },
  data: { percent: 0 },
  observers: {
    'value, max': function (value, max) {
      const percent = max > 0 ? Math.max(0, Math.min(100, Math.round(value / max * 100))) : 0
      this.setData({ percent })
    }
  }
})
