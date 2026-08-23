'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    label: { type: String, value: '合计' },
    price: { type: String, value: '0.00' },
    currency: { type: String, value: '¥' },
    note: { type: String, value: '' },
    buttonText: { type: String, value: '提交订单' },
    loading: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    fixed: { type: Boolean, value: false },
    safeArea: { type: Boolean, value: true }
  },
  methods: { submit() { if (!this.data.disabled && !this.data.loading) this.triggerEvent('submit') } }
})
