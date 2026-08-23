'use strict'

const { NAV_ITEMS } = require('../../utils/nav')

Page({
  data: {
    topInset: 24,
    navItems: NAV_ITEMS,
    metrics: [
      { value: '55', label: '原生组件', note: '零依赖' },
      { value: '优', label: '可读对比', note: '户外清晰' },
      { value: '0', label: '构建步骤', note: '复制即用' }
    ],
    activity: [
      { icon: 'shield', title: '对比度守护', desc: '关键文本与操作保持清晰易读', status: '已就绪' },
      { icon: 'wave', title: '极地海洋', desc: '轻盈画布与深海结构协同', status: '新主题' },
      { icon: 'code', title: '原生运行', desc: '微信原生结构，无需额外打包', status: '零依赖' }
    ]
  },

  onLoad() {
    const app = getApp()
    this.setData({ topInset: app.globalData.statusBarHeight })
  },

  openComponents() {
    wx.reLaunch({ url: '/pages/components/components' })
  },

  openExtensions() {
    wx.navigateTo({ url: '/pages/extensions/extensions' })
  }
})
