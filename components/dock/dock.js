// Configurable floating navigation. The consuming app owns routes and labels.
'use strict'

const { normalizeNavItems } = require('../../utils/dock')

Component({
  properties: {
    // 当前页对应的项 key(home/report/mine/queue/detections/alerts)
    active: { type: null, value: '' },
    navItems: { type: Array, value: [] },
    reducedMotion: { type: Boolean, value: false }
  },

  data: {
    items: [],
    indicatorVisible: false,
    indicatorStyle: ''
  },

  observers: {
    'navItems, active': function () {
      this._syncItems()
    }
  },

  lifetimes: {
    attached() {
      this._syncItems()
    }
  },

  methods: {
    _syncItems() {
      const items = normalizeNavItems(this.data.navItems)
      const activeIndex = items.findIndex((item) => item.key === this.data.active)
      this.setData({
        items,
        indicatorVisible: activeIndex >= 0,
        indicatorStyle: activeIndex < 0 || !items.length
          ? ''
          : `width:${100 / items.length}%;transform:translate3d(${activeIndex * 100}%,0,0)`
      })
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
