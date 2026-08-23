'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    value: { type: Number, value: 0 },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    showValue: { type: Boolean, value: true },
    label: { type: String, value: '' }
  },
  methods: {
    changing(event) {
      this.triggerEvent('changing', { value: event.detail.value })
    },
    change(event) {
      this.triggerEvent('change', { value: event.detail.value })
    }
  }
})
