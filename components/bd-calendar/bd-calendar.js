'use strict'

const { iso, parseIsoDate } = require('../../utils/calendar')

Component({
  options: { styleIsolation: 'apply-shared' },
  properties: {
    value: { type: String, value: '' },
    min: { type: String, value: '' },
    max: { type: String, value: '' },
    weekStartsOnMonday: { type: Boolean, value: true }
  },
  data: { year: 0, month: 0, days: [], weekLabels: ['一', '二', '三', '四', '五', '六', '日'] },
  lifetimes: {
    attached() {
      this._attached = true
      const selected = parseIsoDate(this.data.value)
      const date = selected ? selected.date : new Date()
      this.setData({ year: date.getFullYear(), month: date.getMonth() }, () => this._build())
    },
    detached() { this._attached = false }
  },
  observers: {
    value(value) {
      if (!this._attached) return
      const selected = parseIsoDate(value)
      if (selected && (selected.year !== this.data.year || selected.month !== this.data.month)) {
        this.setData({ year: selected.year, month: selected.month }, () => this._build())
      } else {
        this._build()
      }
    },
    min() { if (this._attached) this._build() },
    max() { if (this._attached) this._build() },
    weekStartsOnMonday() {
      this.setData({ weekLabels: this.data.weekStartsOnMonday ? ['一', '二', '三', '四', '五', '六', '日'] : ['日', '一', '二', '三', '四', '五', '六'] })
      if (this._attached) this._build()
    }
  },
  methods: {
    _build() {
      const year = this.data.year
      const month = this.data.month
      if (!year && year !== 0) return
      const first = new Date(year, month, 1).getDay()
      const offset = this.data.weekStartsOnMonday ? (first + 6) % 7 : first
      const count = new Date(year, month + 1, 0).getDate()
      const todayDate = new Date()
      const today = iso(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
      const selected = parseIsoDate(this.data.value)
      const min = parseIsoDate(this.data.min)
      const max = parseIsoDate(this.data.max)
      const days = []
      for (let index = 0; index < 42; index++) {
        const day = index - offset + 1
        if (day < 1 || day > count) {
          days.push({ key: 'blank-' + index, blank: true })
        } else {
          const value = iso(year, month, day)
          days.push({ key: value, day, value, selected: Boolean(selected && value === selected.value), today: value === today, disabled: Boolean((min && value < min.value) || (max && value > max.value)) })
        }
      }
      this.setData({ days })
    },
    previous() { this._move(-1) },
    next() { this._move(1) },
    _move(delta) {
      const date = new Date(this.data.year, this.data.month + delta, 1)
      this.setData({ year: date.getFullYear(), month: date.getMonth() }, () => this._build())
      this.triggerEvent('monthchange', { year: date.getFullYear(), month: date.getMonth() + 1 })
    },
    select(event) {
      const day = this.data.days[Number(event.currentTarget.dataset.index)]
      if (!day || day.blank || day.disabled) return
      this.triggerEvent('change', { value: day.value })
    }
  }
})
