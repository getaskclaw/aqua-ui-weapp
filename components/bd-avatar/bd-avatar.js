'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    src: { type: String, value: '' },
    text: { type: String, value: '' },
    size: { type: Number, value: 88 },
    shape: { type: String, value: 'circle' },
    status: { type: String, value: '' }
  }
})
