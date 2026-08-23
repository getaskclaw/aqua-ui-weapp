'use strict'

Component({
  options: { multipleSlots: true, styleIsolation: 'apply-shared' },
  properties: {
    value: { type: Number, optionalTypes: [String], value: '' },
    max: { type: Number, value: 99 },
    dot: { type: Boolean, value: false },
    semantic: { type: String, value: 'danger' },
    hidden: { type: Boolean, value: false }
  },
  data: { displayValue: '' },
  observers: {
    'value, max, dot': function (value, max, dot) {
      const number = Number(value)
      this.setData({ displayValue: dot ? '' : (Number.isFinite(number) && number > max ? max + '+' : String(value)) })
    }
  }
})
