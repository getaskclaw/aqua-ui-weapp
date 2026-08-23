// 悬浮 dock(WO-010):玻璃胶囊底栏,按身份渲染导航项(纯逻辑在
// utils/dock.js)。现有页面均非 tabBar 页,导航一律 wx.reLaunch
// (不改 app.json tabBar 配置);目标 = 当前页时不重复跳转。
'use strict'

const { dockItemsFor } = require('../../utils/dock')

Component({
  properties: {
    // 当前页对应的项 key(home/report/mine/queue/detections/alerts)
    active: { type: String, value: '' }
  },

  data: {
    items: []
  },

  lifetimes: {
    attached() {
      this._syncItems()
    }
  },

  pageLifetimes: {
    show() {
      // 绑定可能在「我的」页刚完成:每次页面展示时按最新身份重算
      this._syncItems()
    }
  },

  methods: {
    _syncItems() {
      const app = getApp()
      const identity = app && app.globalData ? app.globalData.identity : null
      this.setData({ items: dockItemsFor(identity) })
    },

    open(event) {
      const url = event.currentTarget.dataset.url
      if (!url) return
      const pages = getCurrentPages()
      const current = pages.length ? `/${pages[pages.length - 1].route}` : null
      if (url === current) return
      wx.reLaunch({ url })
    }
  }
})
