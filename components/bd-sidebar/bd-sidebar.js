'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    active: { type: null, value: '' },
    compact: { type: Boolean, value: false }
  },
  data: { normalized: [] },
  observers: {
    items(items) {
      this.setData({ normalized: (items || []).map((item, index) => {
        const source = item || {}
        const selectionKey = source.key === undefined ? index : source.key
        return Object.assign({}, source, { selectionKey, normalizedKey: String(selectionKey) })
      }) })
    }
  },
  methods: {
    select(event) {
      const index = Number(event.currentTarget.dataset.index)
      const item = this.data.normalized[index]
      if (!item || item.disabled) return
      const key = item.selectionKey
      this.setData({ active: key })
      this.triggerEvent('change', { key, index, item })
    }
  }
})
