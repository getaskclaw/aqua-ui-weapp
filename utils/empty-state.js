// bd-empty-state 场景映射(WO-011):四种空态场景的默认文案/图标,
// 全场景统一收口,页面不再逐页手写空态。纯 JS 无 wx 依赖,node 可测;
// components/bd-empty-state 只做渲染,允许属性级覆盖默认值。
'use strict'

const SCENES = {
  'no-data': {
    icon: 'empty-doc',
    title: '暂无数据',
    desc: '当前没有可展示的记录',
    actionText: ''
  },
  unbound: {
    icon: 'user',
    title: '尚未绑定',
    desc: '绑定员工身份后可查看工作台内容',
    actionText: ''
  },
  'not-found': {
    icon: 'location',
    title: '页面不存在',
    desc: '内容可能已被移动或删除',
    actionText: '返回首页'
  },
  error: {
    icon: 'warn',
    title: '加载失败',
    desc: '网络或服务异常，请稍后重试',
    actionText: '重试'
  }
}

const SCENE_NAMES = Object.keys(SCENES)

// 解析场景:未知场景返回 null(不猜默认,调用方显式处理);
// overrides 中非空字符串覆盖对应默认字段。
function emptyStateFor(scene, overrides = {}) {
  const base = SCENES[scene]
  if (!base) return null
  const view = { scene, ...base }
  for (const key of ['icon', 'title', 'desc', 'actionText']) {
    if (typeof overrides[key] === 'string' && overrides[key] !== '') {
      view[key] = overrides[key]
    }
  }
  return view
}

module.exports = { SCENES, SCENE_NAMES, emptyStateFor }
