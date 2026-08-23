'use strict'

function buildSelection(groups, selected) {
  const source = selected || {}
  const selection = {}
  const seenKeys = Object.create(null)
  let valid = Array.isArray(groups) && groups.length > 0
  const viewGroups = (groups || []).map((group, groupIndex) => {
    const key = String(group.key === undefined ? groupIndex : group.key)
    if (seenKeys[key]) valid = false
    seenKeys[key] = true
    const options = (group.options || []).map((option, optionIndex) => {
      const normalized = option && typeof option === 'object' ? option : { label: String(option), value: option }
      const value = normalized.value === undefined ? optionIndex : normalized.value
      const active = source[key] === value && !normalized.disabled
      if (active) selection[key] = value
      return Object.assign({}, normalized, { value, selected: active })
    })
    if (!options.some((option) => option.selected)) valid = false
    return Object.assign({}, group, { key, options })
  })
  return { selection, viewGroups, valid }
}

function quantityIsValid(quantity, min, max) {
  return Number.isFinite(quantity) && quantity >= min && quantity <= max
}

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
    confirmText: { type: String, value: '确认' },
    reducedMotion: { type: Boolean, value: false }
  },
  data: { viewGroups: [], selection: {}, draftQuantity: 1, canConfirm: false },
  observers: {
    'groups, selected, quantity, min, max': function(groups, selected, quantity, min, max) {
      const state = buildSelection(groups, selected)
      this.setData({
        selection: state.selection,
        viewGroups: state.viewGroups,
        draftQuantity: quantity,
        canConfirm: state.valid && quantityIsValid(quantity, min, max)
      })
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
      const state = buildSelection(this.data.groups, selection)
      this.setData({ selection: state.selection, viewGroups: state.viewGroups, canConfirm: state.valid && quantityIsValid(this.data.quantity, this.data.min, this.data.max) })
      this.triggerEvent('change', { selected: selection, group, option })
    },
    quantityChange(event) {
      const quantity = event.detail.value
      const state = buildSelection(this.data.groups, this.data.selection)
      this.setData({ draftQuantity: quantity, canConfirm: state.valid && quantityIsValid(quantity, this.data.min, this.data.max) })
      this.triggerEvent('quantitychange', event.detail)
    },
    confirm() {
      const state = buildSelection(this.data.groups, this.data.selection)
      const canConfirm = state.valid && quantityIsValid(this.data.draftQuantity, this.data.min, this.data.max)
      if (!canConfirm) {
        this.setData({ selection: state.selection, viewGroups: state.viewGroups, canConfirm: false })
        return
      }
      this.triggerEvent('confirm', { selected: state.selection, quantity: this.data.draftQuantity })
    }
  }
})
