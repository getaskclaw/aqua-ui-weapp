'use strict'

const { NAV_ITEMS } = require('../../utils/nav')

Page({
  data: {
    topInset: 24,
    reducedMotion: false,
    navItems: NAV_ITEMS,
    loading: false,
    showSkeleton: false,
    species: '中华鲟',
    rows: [
      { icon: 'palette', title: '颜色令牌', desc: '深海、水色与语义色', tag: '24 项' },
      { icon: 'layers', title: '表面层级', desc: '玻璃、实体、水色与深海', tag: '4 层' },
      { icon: 'shield', title: '交互状态', desc: '加载、禁用与错误反馈', tag: '完整' }
    ]
  },

  onLoad() {
    const app = getApp()
    this.setData({ topInset: app.globalData.statusBarHeight, reducedMotion: Boolean(app.globalData.reducedMotion) })
  },

  demoLoading() {
    this.setData({ loading: true })
    setTimeout(() => this.setData({ loading: false }), 1200)
  },

  toggleSkeleton() {
    this.setData({ showSkeleton: !this.data.showSkeleton })
  },

  onSpecies(event) {
    this.setData({ species: event.detail.value })
  },

  notify() {
    wx.showToast({ title: '交互反馈正常', icon: 'none' })
  }
})
