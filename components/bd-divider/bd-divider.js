'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    text: { type: String, value: '' },
    align: { type: String, value: 'center' },
    dashed: { type: Boolean, value: false }
  }
})
