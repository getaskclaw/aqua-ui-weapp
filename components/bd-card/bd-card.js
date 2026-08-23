// Layered surface: glass, solid, tint, or deep ocean.
'use strict'

Component({
  options: { styleIsolation: 'apply-shared', multipleSlots: true },

  properties: {
    title: { type: String, value: '' },
    subtitle: { type: String, value: '' },
    padding: { type: String, value: 'normal' }, // normal | compact | flush
    tone: { type: String, value: 'glass' }, // glass | solid | tint | ocean
    interactive: { type: Boolean, value: false }
  },

  methods: {
    onTap() {
      if (this.data.interactive) this.triggerEvent('tap')
    }
  }
})
