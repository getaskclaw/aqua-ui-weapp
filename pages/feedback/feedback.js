'use strict'

const { NAV_ITEMS } = require('../../utils/nav')

Page({
  data: {
    topInset: 24,
    navItems: NAV_ITEMS,
    modalVisible: false,
    sheetVisible: false,
    reducedMotion: false,
    currentStep: 1,
    accordionOpen: ['material'],
    accordionItems: [
      { key: 'material', title: '为什么玻璃不能铺满页面？', icon: 'layers', content: '玻璃材质用于提升导航和关键操作，内容层保持稳定，才能建立清晰层级。' },
      { key: 'contrast', title: '如何保证文字清晰？', icon: 'shield', content: '提高内容表面的不透明度，并让正文与背景保持充足的明暗差异。' },
      { key: 'motion', title: '动效应该持续多久？', icon: 'activity', content: '常用反馈保持快速克制，优先让状态变化被感知，而不是展示动画本身。' }
    ],
    steps: [
      { title: '提交', desc: '资料已送达' },
      { title: '复核', desc: '正在核验' },
      { title: '完成', desc: '生成结论' }
    ],
    timelineItems: [
      { title: '资料上传完成', desc: '共十二项内容，完整性检查通过。', time: '刚刚', semantic: 'ok' },
      { title: '进入人工复核', desc: '预计十分钟内完成。', time: '两分钟前', semantic: 'info' },
      { title: '发现一项提醒', desc: '现场照片建议补充近景。', time: '五分钟前', semantic: 'warn' }
    ],
    sheetActions: [
      { name: '拍摄照片', desc: '使用相机记录现场', icon: 'camera' },
      { name: '从相册选择', desc: '选择已有影像', icon: 'image' },
      { name: '移除记录', desc: '此操作无法撤销', icon: 'empty-doc', danger: true }
    ]
  },

  onLoad() {
    const app = getApp()
    this.setData({
      topInset: app.globalData.statusBarHeight,
      reducedMotion: Boolean(app.globalData.reducedMotion)
    })
  },

  onReducedMotion(event) {
    const reducedMotion = event.detail.checked
    getApp().setReducedMotion(reducedMotion)
    this.setData({ reducedMotion })
  },

  openModal() { this.setData({ modalVisible: true }) },
  closeModal() { this.setData({ modalVisible: false }) },
  confirmModal() {
    this.setData({ modalVisible: false })
    wx.showToast({ title: '操作已确认', icon: 'none' })
  },
  openSheet() { this.setData({ sheetVisible: true }) },
  closeSheet() { this.setData({ sheetVisible: false }) },
  selectSheet(event) {
    this.setData({ sheetVisible: false })
    wx.showToast({ title: event.detail.action.name, icon: 'none' })
  },
  onAccordion(event) { this.setData({ accordionOpen: event.detail.openKeys }) },
  notify() { wx.showToast({ title: '反馈已送达', icon: 'none' }) }
})
