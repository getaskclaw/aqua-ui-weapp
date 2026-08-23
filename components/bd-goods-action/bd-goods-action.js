'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    actions: { type: Array, value: [] },
    primaryText: { type: String, value: '立即购买' },
    secondaryText: { type: String, value: '加入购物车' },
    showSecondary: { type: Boolean, value: true },
    fixed: { type: Boolean, value: false },
    safeArea: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    select(event) { const index = Number(event.currentTarget.dataset.index); const item = this.data.actions[index]; if (item && !item.disabled) this.triggerEvent('select', { index, item }) },
    primary() { if (!this.data.disabled) this.triggerEvent('primary') },
    secondary() { if (!this.data.disabled) this.triggerEvent('secondary') }
  }
})
