'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    visible: { type: Boolean, value: false },
    title: { type: String, value: '选择规格' },
    image: { type: String, value: '' },
    price: { type: String, value: '' },
    currency: { type: String, value: '¥' },
    groups: { type: Array, value: [] },
    selected: { type: Object, value: {} },
    quantity: { type: Number, value: 1 },
    min: { type: Number, value: 1 },
    max: { type: Number, value: 99 },
    confirmText: { type: String, value: '确认' }
  },
  data: { viewGroups: [], selection: {} },
  observers: {
    'groups, selected': function(groups, selected) {
      const selection = Object.assign({}, selected || {})
      const viewGroups = (groups || []).map((group, groupIndex) => {
        const key = String(group.key === undefined ? groupIndex : group.key)
        return Object.assign({}, group, { key, options: (group.options || []).map((option, optionIndex) => {
          const normalized = typeof option === 'object' ? option : { label: String(option), value: option }
          const value = normalized.value === undefined ? optionIndex : normalized.value
          return Object.assign({}, normalized, { value, selected: selection[key] === value })
        }) })
      })
      this.setData({ selection, viewGroups })
    }
  },
  methods: {
    close() { this.triggerEvent('cancel') },
    choose(event) {
      const groupIndex = Number(event.currentTarget.dataset.group)
      const optionIndex = Number(event.currentTarget.dataset.option)
      const group = this.data.viewGroups[groupIndex]
      const option = group && group.options[optionIndex]
      if (!option || option.disabled) return
      const selection = Object.assign({}, this.data.selection, { [group.key]: option.value })
      const viewGroups = this.data.viewGroups.map((item, index) => index !== groupIndex ? item : Object.assign({}, item, { options: item.options.map((entry, entryIndex) => Object.assign({}, entry, { selected: entryIndex === optionIndex })) }))
      this.setData({ selection, viewGroups })
      this.triggerEvent('change', { selected: selection, group, option })
    },
    quantityChange(event) { this.setData({ quantity: event.detail.value }); this.triggerEvent('quantitychange', event.detail) },
    confirm() { this.triggerEvent('confirm', { selected: this.data.selection, quantity: this.data.quantity }) }
  }
})
