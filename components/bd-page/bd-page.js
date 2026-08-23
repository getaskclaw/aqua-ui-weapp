// Full-page canvas with a safe custom chrome.
'use strict'

Component({
  options: { styleIsolation: 'apply-shared', multipleSlots: true },

  properties: {
    chrome: { type: Boolean, value: false }, // navy 标题条
    title: { type: String, value: '' },
    subtitle: { type: String, value: '' },
    topInset: { type: Number, value: 24 }, // px, from wx.getWindowInfo().statusBarHeight
    padded: { type: Boolean, value: true }, // 32rpx 内容留白
    dockSpace: { type: Boolean, value: false }, // 挂 dock 的页预留底距
    reducedMotion: { type: Boolean, value: false }
  }
})
