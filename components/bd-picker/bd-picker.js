'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    visible: { type: Boolean, value: false },
    title: { type: String, value: '请选择' },
    options: { type: Array, value: [] },
    value: { type: null, value: '' },
    confirmText: { type: String, value: '确认' },
    reducedMotion: { type: Boolean, value: false }
  },
  data: { normalized: [], draft: '', canConfirm: false },
  observers: {
    'options, value': function(options, value) {
      const normalized = (options || []).map((item, index) => item && typeof item === 'object' ? { label: String(item.label === undefined ? item.value : item.label), value: item.value === undefined ? index : item.value, disabled: Boolean(item.disabled) } : { label: String(item), value: item, disabled: false })
      const canConfirm = normalized.some((item) => !item.disabled && item.value === value)
      this.setData({ normalized, draft: value, canConfirm })
    },
    visible(visible) {
      if (!visible) return
      const canConfirm = this.data.normalized.some((item) => !item.disabled && item.value === this.data.value)
      this.setData({ draft: this.data.value, canConfirm })
    }
  },
  methods: {
    choose(event) {
      const item = this.data.normalized[Number(event.currentTarget.dataset.index)]
      if (!item || item.disabled) return
      this.setData({ draft: item.value, canConfirm: true })
      this.triggerEvent('preview', { value: item.value, item })
    },
    close() { this.triggerEvent('cancel') },
    confirm() {
      const item = this.data.normalized.find((option) => !option.disabled && option.value === this.data.draft)
      if (!item) {
        this.setData({ canConfirm: false })
        return
      }
      this.triggerEvent('confirm', { value: this.data.draft, item })
    }
  }
})
