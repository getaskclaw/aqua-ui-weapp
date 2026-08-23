'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    columns: { type: Number, value: 4 },
    bordered: { type: Boolean, value: false }
  },
  data: { cellWidth: 25 },
  observers: {
    columns(value) {
      this.setData({ cellWidth: 100 / Math.max(1, value) })
    }
  },
  methods: {
    choose(event) {
      const index = Number(event.currentTarget.dataset.index)
      this.triggerEvent('select', { index, item: this.data.items[index] })
    }
  }
})
