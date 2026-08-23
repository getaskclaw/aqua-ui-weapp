'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    value: { type: String, value: '' },
    label: { type: String, value: '' },
    placeholder: { type: String, value: '' },
    type: { type: String, value: 'text' },
    password: { type: Boolean, value: false },
    multiline: { type: Boolean, value: false },
    maxlength: { type: Number, value: 140 },
    disabled: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    clearable: { type: Boolean, value: true },
    hint: { type: String, value: '' },
    error: { type: String, value: '' }
  },
  methods: {
    input(event) {
      const value = event.detail.value
      this.triggerEvent('input', { value })
    },
    clear() {
      if (this.data.disabled) return
      this.triggerEvent('input', { value: '' })
      this.triggerEvent('clear')
    },
    focus(event) { this.triggerEvent('focus', event.detail) },
    blur(event) { this.triggerEvent('blur', event.detail) }
  }
})
