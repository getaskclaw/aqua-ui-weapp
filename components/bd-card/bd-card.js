// bd-card:玻璃材质卡(复用 app.wxss .glass,单一来源)。padding 变体
// normal/compact/flush;标题支持 title 属性或命名 slot(title 优先)。
'use strict'

Component({
  options: { styleIsolation: 'apply-shared', multipleSlots: true },

  properties: {
    title: { type: String, value: '' },
    padding: { type: String, value: 'normal' } // normal | compact | flush
  }
})
