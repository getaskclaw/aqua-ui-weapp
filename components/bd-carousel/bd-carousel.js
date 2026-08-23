'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    current: { type: Number, value: 0 },
    height: { type: Number, value: 360 },
    autoplay: { type: Boolean, value: true },
    interval: { type: Number, value: 4200 },
    duration: { type: Number, value: 420 },
    circular: { type: Boolean, value: true },
    indicator: { type: Boolean, value: true },
    imageMode: { type: String, value: 'aspectFill' }
  },
  methods: {
    change(event) { this.setData({ current: event.detail.current }); this.triggerEvent('change', event.detail) },
    select(event) { const index = Number(event.currentTarget.dataset.index); this.triggerEvent('select', { index, item: this.data.items[index] }) }
  }
})
