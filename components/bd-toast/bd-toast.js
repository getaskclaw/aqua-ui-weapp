'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    visible: { type: Boolean, value: false },
    message: { type: String, value: '' },
    semantic: { type: String, value: 'neutral' },
    position: { type: String, value: 'top' },
    mask: { type: Boolean, value: false }
  },
  methods: {
    close() { this.triggerEvent('close') },
    stop() {}
  }
})
