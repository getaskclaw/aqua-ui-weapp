// Pure helpers for the configurable dock. No application routes or identity rules.
'use strict'

const MAX_DOCK_ITEMS = 5

function normalizeNavItems(items) {
  if (!Array.isArray(items)) return []
  return items
    .filter((item) => item && (typeof item.key === 'string' || typeof item.key === 'number') && item.label && item.icon && item.url)
    .slice(0, MAX_DOCK_ITEMS)
    .map((item) => ({ key: item.key, label: item.label, icon: item.icon, url: item.url }))
}

function routeMatches(url, route) {
  if (!url || !route) return false
  return url.replace(/^\//, '') === route.replace(/^\//, '')
}

module.exports = { MAX_DOCK_ITEMS, normalizeNavItems, routeMatches }
