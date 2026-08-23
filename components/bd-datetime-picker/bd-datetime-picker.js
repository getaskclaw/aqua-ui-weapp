'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    label: { type: String, value: '' },
    date: { type: String, value: '' },
    time: { type: String, value: '' },
    start: { type: String, value: '' },
    end: { type: String, value: '' },
    disabled: { type: Boolean, value: false }
  },
  methods: {
    dateChange(event) { this.setData({ date: event.detail.value }); this.emit() },
    timeChange(event) { this.setData({ time: event.detail.value }); this.emit() },
    emit() { this.triggerEvent('change', { date: this.data.date, time: this.data.time, value: (this.data.date + ' ' + this.data.time).trim() }) }
  }
})
