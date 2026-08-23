'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    active: { type: String, value: '' },
    centered: { type: Boolean, value: false },
    reducedMotion: { type: Boolean, value: false }
  },
  data: {
    indicatorVisible: false,
    indicatorStyle: ''
  },
  observers: {
    'items, active, centered': function () {
      if (this._ready) this._scheduleIndicator()
    }
  },
  lifetimes: {
    ready() {
      this._ready = true
      this._scheduleIndicator()
    },
    detached() {
      this._ready = false
    }
  },
  methods: {
    _scheduleIndicator() {
      wx.nextTick(() => this._measureIndicator())
    },
    _measureIndicator() {
      if (!this._ready) return
      const activeIndex = this.data.items.findIndex((item) => item.key === this.data.active)
      if (activeIndex < 0) {
        this.setData({ indicatorVisible: false })
        return
      }
      this.createSelectorQuery()
        .select('.bd-tabs').boundingClientRect()
        .selectAll('.bd-tab').boundingClientRect()
        .exec((results) => {
          if (!this._ready) return
          const track = results[0]
          const tabs = results[1] || []
          const activeTab = tabs[activeIndex]
          if (!track || !activeTab) {
            this.setData({ indicatorVisible: false })
            return
          }
          const x = activeTab.left - track.left + 12
          const width = Math.max(0, activeTab.width - 24)
          this.setData({
            indicatorVisible: true,
            indicatorStyle: `width:${width}px;transform:translate3d(${x}px,0,0)`
          })
        })
    },
    choose(event) {
      const index = Number(event.currentTarget.dataset.index)
      const item = this.data.items[index]
      if (!item || item.disabled) return
      this.setData({ active: item.key })
      this.triggerEvent('change', { key: item.key, index, item })
    }
  }
})
