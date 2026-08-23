'use strict'

const { iconNames } = require('../../utils/icons')
const { NAV_ITEMS } = require('../../utils/nav')

const ICON_LABELS = {
  activity: '活动', 'arrow-right': '向右', bell: '通知', camera: '相机', cart: '购物车',
  chart: '图表', check: '完成', chevron: '展开', clock: '时间', code: '代码', compass: '罗盘',
  'empty-doc': '空文档', fish: '鱼类', flag: '标记', grid: '网格', home: '首页', image: '图片',
  inbox: '收件箱', layers: '层级', list: '列表', location: '位置', moon: '夜间', palette: '色盘',
  plus: '添加', scan: '扫描', search: '搜索', settings: '设置', shield: '防护', sparkles: '闪光',
  sun: '日间', upload: '上传', user: '用户', warn: '警示', wave: '波浪'
}

Page({
  data: {
    topInset: 24,
    navItems: NAV_ITEMS,
    photos: [],
    icons: iconNames().map((name) => ({ name, label: ICON_LABELS[name] || '图标' })),
    colors: [
      { name: '深海九五〇', value: '#041724', ink: '#f4ffff' },
      { name: '深海八〇〇', value: '#0a3a52', ink: '#f4ffff' },
      { name: '水色四〇〇', value: '#35e3d5', ink: '#041724' },
      { name: '晴蓝五〇〇', value: '#16b9e6', ink: '#041724' },
      { name: '极地白', value: '#edf8f8', ink: '#092637' },
      { name: '墨色', value: '#092637', ink: '#f4ffff' }
    ]
  },

  onLoad() {
    this.setData({ topInset: getApp().globalData.statusBarHeight })
  },

  onPhotos(event) {
    this.setData({ photos: event.detail.photos })
  },

  copyToken(event) {
    const value = event.currentTarget.dataset.value
    wx.setClipboardData({ data: value })
  }
})
