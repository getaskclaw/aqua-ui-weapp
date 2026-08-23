// Premium action primitive. Backwards compatible with v0.1 variants.
'use strict'

Component({
  properties: {
    variant: { type: String, value: 'primary' }, // primary | ghost | danger
    size: { type: String, value: 'lg' }, // lg | md
    shape: { type: String, value: 'soft' }, // soft | pill
    block: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '' },
    loading: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false }
  },

  methods: {
    onTap(event) {
      if (this.data.disabled || this.data.loading) return
      this.triggerEvent('tap', event.detail)
    }
  }
})
