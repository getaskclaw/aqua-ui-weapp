'use strict'

function pad(value) { return value < 10 ? '0' + value : String(value) }
function iso(year, month, day) { return year + '-' + pad(month + 1) + '-' + pad(day) }

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
      const parsed = this._parse(this.data.value) || new Date()
      this.setData({ year: parsed.getFullYear(), month: parsed.getMonth() })
      this._build()
    }
  },
  observers: {
    value() { if (this.data.year) this._build() },
    min() { if (this.data.year) this._build() },
    max() { if (this.data.year) this._build() },
    weekStartsOnMonday() {
      this.setData({ weekLabels: this.data.weekStartsOnMonday ? ['一', '二', '三', '四', '五', '六', '日'] : ['日', '一', '二', '三', '四', '五', '六'] })
      if (this.data.year) this._build()
    }
  },
  methods: {
    _parse(value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null
      const parts = value.split('-').map(Number)
      return new Date(parts[0], parts[1] - 1, parts[2])
    },
    _build() {
      const year = this.data.year
      const month = this.data.month
      if (!year && year !== 0) return
      const first = new Date(year, month, 1).getDay()
      const offset = this.data.weekStartsOnMonday ? (first + 6) % 7 : first
      const count = new Date(year, month + 1, 0).getDate()
      const todayDate = new Date()
      const today = iso(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
      const days = []
      for (let index = 0; index < 42; index++) {
        const day = index - offset + 1
        if (day < 1 || day > count) {
          days.push({ key: 'blank-' + index, blank: true })
        } else {
          const value = iso(year, month, day)
          days.push({ key: value, day, value, selected: value === this.data.value, today: value === today, disabled: Boolean((this.data.min && value < this.data.min) || (this.data.max && value > this.data.max)) })
        }
      }
      this.setData({ days })
    },
    previous() { this._move(-1) },
    next() { this._move(1) },
    _move(delta) {
      const date = new Date(this.data.year, this.data.month + delta, 1)
      this.setData({ year: date.getFullYear(), month: date.getMonth() })
      this._build()
      this.triggerEvent('monthchange', { year: date.getFullYear(), month: date.getMonth() + 1 })
    },
    select(event) {
      const day = this.data.days[Number(event.currentTarget.dataset.index)]
      if (!day || day.blank || day.disabled) return
      this.setData({ value: day.value })
      this._build()
      this.triggerEvent('change', { value: day.value })
    }
  }
})
