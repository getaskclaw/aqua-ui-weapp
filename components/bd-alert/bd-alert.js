'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    semantic: { type: String, value: 'info' },
    icon: { type: String, value: 'shield' },
    closable: { type: Boolean, value: false }
  },
  data: { visible: true },
  methods: {
    close() {
      this.setData({ visible: false })
      this.triggerEvent('close')
    }
  }
})
