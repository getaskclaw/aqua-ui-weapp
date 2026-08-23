'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    active: { type: null, value: '' },
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
      this._indicatorGeneration = (this._indicatorGeneration || 0) + 1
    }
  },
  pageLifetimes: {
    show() { if (this._ready) this._scheduleIndicator(true) },
    resize() { if (this._ready) this._scheduleIndicator(true) }
  },
  methods: {
    _indicatorSignature() {
      const items = this.data.items.map((item) => item ? [item.key, item.label, item.badge, Boolean(item.disabled)] : null)
      return JSON.stringify([items, this.data.active, Boolean(this.data.centered)])
    },
    _scheduleIndicator(force) {
      const signature = this._indicatorSignature()
      if (!force && signature === this._indicatorInput) return
      this._indicatorInput = signature
      this._indicatorGeneration = (this._indicatorGeneration || 0) + 1
      if (this._indicatorScheduled) return
      this._indicatorScheduled = true
      wx.nextTick(() => {
        this._indicatorScheduled = false
        this._measureIndicator(this._indicatorGeneration)
      })
    },
    _measureIndicator(generation) {
      if (!this._ready) return
      const active = this.data.active
      const activeIndex = this.data.items.findIndex((item) => item && item.key === active)
      if (activeIndex < 0) {
        if (this.data.indicatorVisible) this.setData({ indicatorVisible: false })
        return
      }
      this.createSelectorQuery()
        .select('.bd-tabs').boundingClientRect()
        .selectAll('.bd-tab').boundingClientRect()
        .exec((results) => {
          if (!this._ready || generation !== this._indicatorGeneration || this.data.active !== active) return
          const currentItem = this.data.items[activeIndex]
          if (!currentItem || currentItem.key !== active) return
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
      this.triggerEvent('change', { key: item.key, index, item })
    }
  }
})
