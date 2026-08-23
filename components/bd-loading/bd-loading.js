'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    text: { type: String, value: '正在加载' },
    type: { type: String, value: 'ring' },
    size: { type: Number, value: 48 },
    vertical: { type: Boolean, value: false }
  }
})
