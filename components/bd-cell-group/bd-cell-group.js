'use strict'

Component({
  options: { multipleSlots: true, styleIsolation: 'apply-shared' },
  properties: {
    title: { type: String, value: '' },
    desc: { type: String, value: '' },
    inset: { type: Boolean, value: true },
    tone: { type: String, value: 'solid' }
  }
})
