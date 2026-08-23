'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    visible: { type: Boolean, value: false },
    title: { type: String, value: '请选择' },
    options: { type: Array, value: [] },
    value: { type: null, value: '' },
    confirmText: { type: String, value: '确认' }
  },
  data: { normalized: [], draft: '' },
  observers: {
    'options, value': function(options, value) {
      const normalized = (options || []).map((item, index) => typeof item === 'object' ? { label: String(item.label === undefined ? item.value : item.label), value: item.value === undefined ? index : item.value, disabled: Boolean(item.disabled) } : { label: String(item), value: item, disabled: false })
      this.setData({ normalized, draft: value })
    },
    visible(visible) { if (visible) this.setData({ draft: this.data.value }) }
  },
  methods: {
    choose(event) {
      const item = this.data.normalized[Number(event.currentTarget.dataset.index)]
      if (!item || item.disabled) return
      this.setData({ draft: item.value })
      this.triggerEvent('preview', { value: item.value, item })
    },
    close() { this.triggerEvent('cancel') },
    confirm() {
      const item = this.data.normalized.find((option) => option.value === this.data.draft)
      this.triggerEvent('confirm', { value: this.data.draft, item })
    }
  }
})
