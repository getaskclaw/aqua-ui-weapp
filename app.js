'use strict'

App({
  globalData: {
    statusBarHeight: 24,
    reducedMotion: false
  },

  onLaunch() {
    try {
      const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
      this.globalData.statusBarHeight = info.statusBarHeight || 24
    } catch (error) {
      this.globalData.statusBarHeight = 24
    }
  },

  setReducedMotion(value) {
    this.globalData.reducedMotion = Boolean(value)
  }
})
