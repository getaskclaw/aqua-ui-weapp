'use strict'

const { NAV_ITEMS } = require('../../utils/nav')

Page({
  data: {
    topInset: 24,
    reducedMotion: false,
    navItems: NAV_ITEMS,
    searchValue: '',
    radioValue: 'all',
    tabValue: 'overview',
    segmentValue: 'day',
    sliderValue: 64,
    rateValue: 4,
    pageValue: 2,
    gridItems: [
      { key: 'scan', label: '扫描', note: '识别', icon: 'scan' },
      { key: 'camera', label: '拍摄', note: '记录', icon: 'camera' },
      { key: 'location', label: '位置', note: '附近', icon: 'location' },
      { key: 'chart', label: '统计', note: '趋势', icon: 'chart' }
    ],
    radioItems: [
      { value: 'all', label: '全部', desc: '显示所有记录' },
      { value: 'verified', label: '已确认', desc: '仅显示已复核内容' },
      { value: 'pending', label: '待处理', desc: '需要继续跟进' }
    ],
    tabs: [
      { key: 'overview', label: '概览' },
      { key: 'activity', label: '动态', badge: '8' },
      { key: 'files', label: '文件' },
      { key: 'members', label: '成员' }
    ],
    segments: [
      { key: 'day', label: '日' },
      { key: 'week', label: '周' },
      { key: 'month', label: '月' }
    ]
  },

  onLoad() {
    const app = getApp()
    this.setData({ topInset: app.globalData.statusBarHeight, reducedMotion: Boolean(app.globalData.reducedMotion) })
  },

  onSearchInput(event) { this.setData({ searchValue: event.detail.value }) },
  onRadio(event) { this.setData({ radioValue: event.detail.value }) },
  onTab(event) { this.setData({ tabValue: event.detail.key }) },
  onSegment(event) { this.setData({ segmentValue: event.detail.key }) },
  onSlider(event) { this.setData({ sliderValue: event.detail.value }) },
  onRate(event) { this.setData({ rateValue: event.detail.value }) },
  onPage(event) { this.setData({ pageValue: event.detail.current }) },
  notify() { wx.showToast({ title: '控件响应正常', icon: 'none' }) }
})
