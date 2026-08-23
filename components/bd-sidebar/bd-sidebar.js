'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    active: { type: String, value: '' },
    compact: { type: Boolean, value: false }
  },
  data: { normalized: [] },
  observers: {
    items(items) {
      this.setData({ normalized: (items || []).map((item, index) => Object.assign({}, item, { normalizedKey: String(item.key === undefined ? index : item.key) })) })
    }
  },
  methods: {
    select(event) {
      const index = Number(event.currentTarget.dataset.index)
      const item = this.data.normalized[index]
      if (!item || item.disabled) return
      const key = item.key === undefined ? String(index) : String(item.key)
      this.setData({ active: key })
      this.triggerEvent('change', { key, index, item })
    }
  }
})
