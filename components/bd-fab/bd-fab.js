'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    icon: { type: String, value: 'plus' },
    text: { type: String, value: '' },
    position: { type: String, value: 'right' },
    bottom: { type: Number, value: 180 },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    tap() {
      if (!this.data.disabled) this.triggerEvent('tap')
    }
  }
})
