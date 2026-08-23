'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    text: { type: String, value: '' },
    semantic: { type: String, value: 'info' },
    icon: { type: String, value: 'bell' },
    closable: { type: Boolean, value: false },
    actionText: { type: String, value: '' }
  },
  data: { visible: true },
  methods: {
    close() {
      this.setData({ visible: false })
      this.triggerEvent('close')
    },
    action() { this.triggerEvent('action') }
  }
})
