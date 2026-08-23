'use strict'

function pad(value) { return value < 10 ? '0' + value : String(value) }
function iso(year, month, day) { return year + '-' + pad(month + 1) + '-' + pad(day) }

function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null
  const parts = value.split('-').map(Number)
  const date = new Date(0)
  date.setHours(0, 0, 0, 0)
  date.setFullYear(parts[0], parts[1] - 1, parts[2])
  if (date.getFullYear() !== parts[0] || date.getMonth() !== parts[1] - 1 || date.getDate() !== parts[2]) return null
  return { year: parts[0], month: parts[1] - 1, day: parts[2], value: iso(parts[0], parts[1] - 1, parts[2]), date }
}

module.exports = { pad, iso, parseIsoDate }
