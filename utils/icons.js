// bd-icon 命名图标集(WO-011):内联 SVG 注册表,dock 与页面统一引用,
// 替换全部 unicode 占位图标。纯 JS 无 wx 依赖,node --test 直接可测;
// components/bd-icon 只做 data URI 渲染胶水。
//
// 约定:
//   - 24x24 网格、stroke 风格(线宽 2、圆角端点),与 Aqua Glass 线性观感一致;
//   - 图标体内 {c} 为颜色占位,iconSvg() 注入;
//   - 新增图标 = 在 ICONS 加一行,components/kitchensink 自动陈列。
//   - 色值机制:SVG 经 data URI 注入(<image>/background),无法引用 CSS var,
//     写死是机制约束非散写;DEFAULT_COLOR='#41626f' 对应 var(--sub),
//     token 改版时须同步此处(勿当硬编码清理)。
'use strict'

const DEFAULT_COLOR = '#41626f' // var(--sub)

const ICONS = {
  // ---- 页面/场景 ----
  fish: '<path d="M3 12c2.5-3.5 5.8-5 9-5 2.6 0 4.9 0.9 6.5 2.3L21 7v10l-2.5-2.3C16.9 16.1 14.6 17 12 17c-3.2 0-6.5-1.5-9-5z"/><circle cx="7.5" cy="10.8" r="1" fill="{c}" stroke="none"/>',
  camera: '<path d="M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="12.5" r="3.5"/>',
  warn: '<path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5"/><path d="M12 17.2v0.3"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
  'empty-doc': '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5V8h4"/><path d="M9.5 13h5"/><path d="M9.5 16.5h3.5"/>',
  location: '<path d="M12 21s-6.5-5.7-6.5-10.5A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.5C18.5 15.3 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.5 2"/>',
  // ---- dock 五项(home + 其余四项;staff dock 复用同集) ----
  home: '<path d="M4 11l8-7 8 7"/><path d="M6.5 9.2V20h11V9.2"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  list: '<path d="M8.5 6.5H20"/><path d="M8.5 12H20"/><path d="M8.5 17.5H20"/><circle cx="4.8" cy="6.5" r="1" fill="{c}" stroke="none"/><circle cx="4.8" cy="12" r="1" fill="{c}" stroke="none"/><circle cx="4.8" cy="17.5" r="1" fill="{c}" stroke="none"/>',
  flag: '<path d="M6 21V4"/><path d="M6 5h11l-2.5 3.5L17 12H6"/>'
}

function iconNames() {
  return Object.keys(ICONS).sort()
}

function hasIcon(name) {
  return Object.prototype.hasOwnProperty.call(ICONS, name)
}

// 生成完整 SVG 文本;未知名返回 null(调用方决定降级,注册表不猜)。
function iconSvg(name, color = DEFAULT_COLOR) {
  if (!hasIcon(name)) return null
  const body = ICONS[name].replaceAll('{c}', color)
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"` +
    ` stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  )
}

// utf8 安全 base64(小程序无 Buffer/atob 体系,图标 SVG 为 ASCII,
// 但颜色值/未来内容不假设 ASCII,编码器一次写对)。
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
function base64Encode(text) {
  const bytes = []
  for (let i = 0; i < text.length; i++) {
    let code = text.charCodeAt(i)
    if (code < 0x80) {
      bytes.push(code)
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else if (code >= 0xd800 && code <= 0xdbff) {
      const hi = code
      const lo = text.charCodeAt(++i)
      code = 0x10000 + ((hi & 0x3ff) << 10) + (lo & 0x3ff)
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      )
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    }
  }
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]
    const b = bytes[i + 1]
    const c = bytes[i + 2]
    out += B64[a >> 2] + B64[((a & 3) << 4) | (b === undefined ? 0 : b >> 4)]
    out += b === undefined ? '=' : B64[((b & 15) << 2) | (c === undefined ? 0 : c >> 6)]
    out += c === undefined ? '=' : B64[c & 63]
  }
  return out
}

// 渲染入口:<image src> 可直接吃 base64 SVG data URI。
function iconDataUri(name, color = DEFAULT_COLOR) {
  const svg = iconSvg(name, color)
  if (svg === null) return null
  return `data:image/svg+xml;base64,${base64Encode(svg)}`
}

module.exports = { ICONS, DEFAULT_COLOR, iconNames, hasIcon, iconSvg, iconDataUri, base64Encode }
