'use strict'

const { showToast, hideToast } = require('../../utils/toast')

Page({
  data: {
    topInset: 24,
    note: '周末配送前请电话联系',
    popupVisible: false,
    pickerVisible: false,
    skuVisible: false,
    pickerValue: 'standard',
    selectedDate: '2026-08-23',
    date: '2026-08-23',
    time: '14:30',
    region: ['广东省', '深圳市', '南山区'],
    sidebarActive: 'all',
    bdToast: { visible: false, message: '', semantic: 'neutral', position: 'top', mask: false },
    sidebarItems: [
      { key: 'all', label: '全部', badge: '24' },
      { key: 'fresh', label: '生鲜', badge: '8' },
      { key: 'drink', label: '饮品' },
      { key: 'home', label: '居家' }
    ],
    pickerOptions: [
      { label: '标准配送', value: 'standard' },
      { label: '预约配送', value: 'scheduled' },
      { label: '到店自取', value: 'pickup' }
    ],
    carouselItems: [
      { image: '/docs/screenshots/shop-index.png', title: '极地海洋商城', desc: '首页焦点内容示例' },
      { image: '/docs/screenshots/shop-detail.png', title: '商品详情', desc: '清晰呈现价格与操作' },
      { image: '/docs/screenshots/shop-cart.png', title: '购物体验', desc: '状态与反馈保持一致' }
    ],
    skuGroups: [
      { key: 'size', label: '规格', options: [{ label: '小份', value: 'small' }, { label: '标准', value: 'normal' }, { label: '分享装', value: 'large' }] },
      { key: 'temperature', label: '温度', options: [{ label: '常温', value: 'normal' }, { label: '冷藏', value: 'cold' }] }
    ],
    skuSelected: { size: 'normal', temperature: 'cold' },
    goodsActions: [
      { key: 'service', label: '客服', icon: 'bell' },
      { key: 'cart', label: '购物车', icon: 'cart', badge: '2' }
    ]
  },

  onLoad() { this.setData({ topInset: getApp().globalData.statusBarHeight }) },
  inputNote(event) { this.setData({ note: event.detail.value }) },
  sidebarChange(event) { this.setData({ sidebarActive: event.detail.key }) },
  calendarChange(event) { this.setData({ selectedDate: event.detail.value }) },
  datetimeChange(event) { this.setData({ date: event.detail.date, time: event.detail.time }) },
  regionChange(event) { this.setData({ region: event.detail.value }) },
  openPopup() { this.setData({ popupVisible: true }) },
  closePopup() { this.setData({ popupVisible: false }) },
  openPicker() { this.setData({ pickerVisible: true }) },
  closePicker() { this.setData({ pickerVisible: false }) },
  pickerConfirm(event) {
    this.setData({ pickerVisible: false, pickerValue: event.detail.value })
    this.toast('配送方式已更新', 'ok')
  },
  openSku() { this.setData({ skuVisible: true }) },
  closeSku() { this.setData({ skuVisible: false }) },
  skuConfirm(event) {
    this.setData({ skuVisible: false, skuSelected: event.detail.selected })
    this.toast('规格已加入购物车', 'ok')
  },
  toast(message, semantic) { showToast(this, { message, semantic }) },
  closeToast() { hideToast(this) },
  notify() { this.toast('组件响应正常', 'info') }
})
