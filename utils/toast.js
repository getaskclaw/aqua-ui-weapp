'use strict'

function showToast(context, options) {
  if (!context || typeof context.setData !== 'function') throw new TypeError('showToast requires a Page or Component context')
  const config = typeof options === 'string' ? { message: options } : (options || {})
  const duration = Number(config.duration) > 0 ? Number(config.duration) : 2200
  if (context.__bdToastTimer) clearTimeout(context.__bdToastTimer)
  context.setData({
    bdToast: {
      visible: true,
      message: config.message || '',
      semantic: config.semantic || 'neutral',
      position: config.position || 'top',
      mask: Boolean(config.mask)
    }
  })
  context.__bdToastTimer = setTimeout(() => hideToast(context), duration)
}

function hideToast(context) {
  if (!context || typeof context.setData !== 'function') return
  if (context.__bdToastTimer) clearTimeout(context.__bdToastTimer)
  context.__bdToastTimer = null
  context.setData({ 'bdToast.visible': false })
}

module.exports = { showToast, hideToast }
