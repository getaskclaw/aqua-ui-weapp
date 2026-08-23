// bd-button:三 variant(primary 青渐变 / ghost 玻璃描边 / danger 降级描边)
// × 两 size(lg/md),loading/disabled 态吞掉 tap 不上抛。
'use strict'

Component({
  properties: {
    variant: { type: String, value: 'primary' }, // primary | ghost | danger
    size: { type: String, value: 'lg' }, // lg | md
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
