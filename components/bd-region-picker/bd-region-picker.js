'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    label: { type: String, value: '' },
    value: { type: Array, value: [] },
    placeholder: { type: String, value: '请选择地区' },
    customItem: { type: String, value: '' },
    level: { type: String, value: 'region' },
    disabled: { type: Boolean, value: false }
  },
  data: { display: '' },
  observers: {
    value(value) { this.setData({ display: (value || []).join(' · ') }) }
  },
  methods: {
    change(event) {
      const value = event.detail.value || []
      this.setData({ value, display: value.join(' · ') })
      this.triggerEvent('change', { value, code: event.detail.code || [], postcode: event.detail.postcode || '' })
    }
  }
})
