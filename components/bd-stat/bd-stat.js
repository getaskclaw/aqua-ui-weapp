'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    label: { type: String, value: '' },
    value: { type: String, value: '' },
    note: { type: String, value: '' },
    trend: { type: String, value: '' },
    icon: { type: String, value: 'chart' },
    tone: { type: String, value: 'light' }
  }
})
