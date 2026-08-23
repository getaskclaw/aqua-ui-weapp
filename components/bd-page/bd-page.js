// bd-page:页面根替换——mesh 网底 + 安全区 padding + 可选 navy chrome
// 标题槽。styleIsolation: apply-shared 使 app.wxss 的 .mesh/.dock-space
// 材质类在组件内生效(单一来源,不在组件内重复定义网底)。
'use strict'

Component({
  options: { styleIsolation: 'apply-shared', multipleSlots: true },

  properties: {
    chrome: { type: Boolean, value: false }, // navy 标题条
    title: { type: String, value: '' },
    padded: { type: Boolean, value: true }, // 32rpx 内容留白
    dockSpace: { type: Boolean, value: false } // 挂 dock 的页预留底距
  }
})
