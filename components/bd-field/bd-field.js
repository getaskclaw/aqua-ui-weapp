// bd-field:表单字段壳——label + 必填星 + control 默认槽 + hint/error 行。
// 约束文案一律走 hint 下沉展示(标签里禁堆括号);error 存在时优先于 hint。
'use strict'

Component({
  properties: {
    label: { type: String, value: '' },
    required: { type: Boolean, value: false },
    hint: { type: String, value: '' },
    error: { type: String, value: '' }
  }
})
