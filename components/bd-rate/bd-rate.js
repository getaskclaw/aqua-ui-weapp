'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    value: { type: Number, value: 0 },
    max: { type: Number, value: 5 },
    disabled: { type: Boolean, value: false },
    size: { type: Number, value: 42 },
    label: { type: String, value: '' }
  },
  data: { stars: [] },
  observers: {
    max(value) {
      this.setData({ stars: Array.from({ length: Math.max(1, value) }, (_, index) => index + 1) })
    }
  },
  methods: {
    choose(event) {
      if (this.data.disabled) return
      const value = Number(event.currentTarget.dataset.value)
      this.setData({ value })
      this.triggerEvent('change', { value })
    }
  }
})
