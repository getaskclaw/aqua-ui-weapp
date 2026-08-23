'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    items: { type: Array, value: [] },
    current: { type: Number, value: 0 },
    direction: { type: String, value: 'horizontal' }
  },
  data: { displayItems: [] },
  observers: {
    'items, current': function (items, current) {
      this.setData({
        displayItems: items.map((item, index) => ({
          ...item,
          index: index + 1,
          status: index < current ? 'done' : (index === current ? 'current' : 'waiting'),
          last: index === items.length - 1
        }))
      })
    }
  }
})
