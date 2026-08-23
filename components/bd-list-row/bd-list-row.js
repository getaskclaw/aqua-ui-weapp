// bd-list-row:列表行——左图标(icon 名)/标题/描述/右侧 status 槽,
// arrow 加 chevron,按压态 hover-class。tap 事件上抛(不内置导航)。
'use strict'

Component({
  options: { multipleSlots: true },

  properties: {
    icon: { type: String, value: '' }, // bd-icon 名
    iconColor: { type: String, value: '#079e9c' },
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    arrow: { type: Boolean, value: false }
  },

  methods: {
    onTap(event) {
      this.triggerEvent('tap', event.detail)
    }
  }
})
