'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    value: { type: String, value: '' },
    placeholder: { type: String, value: '搜索' },
    disabled: { type: Boolean, value: false },
    clearable: { type: Boolean, value: true }
  },
  methods: {
    input(event) {
      const value = event.detail.value
      this.triggerEvent('input', { value })
    },
    clear() {
      if (this.data.disabled) return
      this.triggerEvent('clear')
      this.triggerEvent('input', { value: '' })
    },
    submit(event) {
      this.triggerEvent('search', { value: event.detail.value })
    }
  }
})
