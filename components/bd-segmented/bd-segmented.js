'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    active: { type: null, value: '' },
    disabled: { type: Boolean, value: false },
    reducedMotion: { type: Boolean, value: false }
  },
  data: {
    displayItems: [],
    indicatorVisible: false,
    indicatorStyle: ''
  },
  observers: {
    'items, active': function (items, active) {
      const displayItems = items.map((item) => item && typeof item === 'object'
        ? { key: item.key, label: item.label, disabled: Boolean(item.disabled) }
        : { key: item, label: item, disabled: false })
      const activeIndex = displayItems.findIndex((item) => item.key === active)
      this.setData({
        displayItems,
        indicatorVisible: activeIndex >= 0,
        indicatorStyle: activeIndex < 0 || !displayItems.length
          ? ''
          : `width:${100 / displayItems.length}%;transform:translate3d(${activeIndex * 100}%,0,0)`
      })
    }
  },
  methods: {
    choose(event) {
      if (this.data.disabled) return
      const index = Number(event.currentTarget.dataset.index)
      const item = this.data.items[index]
      if (item === undefined || item === null || item.disabled) return
      const key = typeof item === 'object' ? item.key : item
      this.setData({ active: key })
      this.triggerEvent('change', { key, index, item })
    }
  }
})
