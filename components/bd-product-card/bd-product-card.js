'use strict'

Component({
  options: { multipleSlots: true, styleIsolation: 'apply-shared' },
  properties: {
    image: { type: String, value: '' },
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    price: { type: String, value: '' },
    originalPrice: { type: String, value: '' },
    currency: { type: String, value: '¥' },
    tag: { type: String, value: '' },
    actionText: { type: String, value: '' },
    layout: { type: String, value: 'horizontal' },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    tap() { if (!this.data.disabled) this.triggerEvent('tap') },
    action() { if (!this.data.disabled) this.triggerEvent('action') }
  }
})
