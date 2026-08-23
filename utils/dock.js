// 悬浮 dock 纯逻辑(WO-010):按身份渲染导航项。不依赖 wx,
// node --test 直接可测;components/dock 只做渲染与 reLaunch 胶水。
//
// 身份契约(同 utils/route.js):
//   未绑定/渔民(含 identity=null 未解析) → 3 项:首页/上报/我的
//   绑定员工(bound===true 且 staff 存在) → 5 项:首页/工作台/检测/告警/我的
//
// 图标(WO-011):icon 字段为 bd-icon 命名图标(utils/icons.js 注册表),
// unicode 占位已清零;dock 与页面统一引用同一命名集。
'use strict'

const FISHER_ITEMS = [
  { key: 'home', label: '首页', icon: 'home', url: '/pages/home/home' },
  { key: 'report', label: '上报', icon: 'plus', url: '/pages/report/report' },
  { key: 'mine', label: '我的', icon: 'user', url: '/pages/mine/mine' }
]

const STAFF_ITEMS = [
  { key: 'home', label: '首页', icon: 'home', url: '/pkg-staff/pages/staff/home' },
  { key: 'queue', label: '工作台', icon: 'grid', url: '/pkg-staff/pages/staff/queue/queue' },
  { key: 'detections', label: '检测', icon: 'list', url: '/pkg-staff/pages/detections/detections' },
  { key: 'alerts', label: '告警', icon: 'flag', url: '/pkg-staff/pages/alerts/alerts' },
  { key: 'mine', label: '我的', icon: 'user', url: '/pages/mine/mine' }
]

function dockItemsFor(identity) {
  if (identity && identity.bound === true && identity.staff) return STAFF_ITEMS
  return FISHER_ITEMS
}

module.exports = { dockItemsFor, FISHER_ITEMS, STAFF_ITEMS }
