'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: '' },
    direction: { type: String, value: 'vertical' },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    choose(event) {
      if (this.data.disabled) return
      const index = Number(event.currentTarget.dataset.index)
      const item = this.data.items[index]
      if (!item || item.disabled) return
      this.setData({ value: item.value })
      this.triggerEvent('change', { value: item.value, item })
    }
  }
})
