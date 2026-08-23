'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    openKeys: { type: Array, value: [] },
    multiple: { type: Boolean, value: false },
    reducedMotion: { type: Boolean, value: false }
  },
  data: { displayItems: [] },
  observers: {
    'items, openKeys': function (items, openKeys) {
      this.setData({ displayItems: items.map((item) => ({ ...item, open: openKeys.indexOf(item.key) >= 0 })) })
    }
  },
  methods: {
    toggle(event) {
      const index = Number(event.currentTarget.dataset.index)
      const item = this.data.items[index]
      if (!item || item.disabled) return
      const key = item.key
      const opened = this.data.openKeys.indexOf(key) >= 0
      const openKeys = opened ? this.data.openKeys.filter((value) => value !== key) : (this.data.multiple ? this.data.openKeys.concat(key) : [key])
      this.setData({ openKeys })
      this.triggerEvent('change', { openKeys, key, opened: !opened })
    }
  }
})
