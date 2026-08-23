'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    checked: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    label: { type: String, value: '' },
    desc: { type: String, value: '' },
    size: { type: String, value: 'normal' }
  },
  methods: {
    toggle() {
      if (this.data.disabled) return
      const checked = !this.data.checked
      this.setData({ checked })
      this.triggerEvent('change', { checked })
    }
  }
})
