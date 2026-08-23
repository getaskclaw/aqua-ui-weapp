// bd-empty-state:全场景统一空态(无数据/未绑定/404/错误),默认文案
// 来自 utils/empty-state.js 场景映射,属性级可覆盖;actionText 存在时
// 渲染 ghost 按钮,点击上抛 action 事件。
'use strict'

const { emptyStateFor } = require('../../utils/empty-state')

Component({
  options: { styleIsolation: 'apply-shared' },

  properties: {
    scene: { type: String, value: 'no-data' }, // no-data | unbound | not-found | error
    icon: { type: String, value: '' },
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    actionText: { type: String, value: '' }
  },

  data: {
    view: { icon: 'empty-doc', title: '', desc: '', actionText: '' }
  },

  observers: {
    'scene, icon, title, desc, actionText': function (scene, icon, title, desc, actionText) {
      const view = emptyStateFor(scene, { icon, title, desc, actionText })
      this.setData({
        view: view || { icon: 'warn', title: scene, desc: '未知空态场景', actionText: '' }
      })
    }
  },

  methods: {
    onAction() {
      this.triggerEvent('action')
    }
  }
})
