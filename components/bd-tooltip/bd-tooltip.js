'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    content: { type: String, value: '' },
    placement: { type: String, value: 'top' },
    visible: { type: Boolean, value: false }
  },
  methods: {
    toggle() {
      const visible = !this.data.visible
      this.setData({ visible })
      this.triggerEvent('change', { visible })
    }
  }
})
