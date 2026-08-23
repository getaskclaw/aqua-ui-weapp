// bd-icon:命名 SVG 图标(注册表在 utils/icons.js)。name 未注册时
// 渲染空盒(占位尺寸保留,QA 截图里可发现缺失,不静默吞掉)。
'use strict'

const { iconDataUri, DEFAULT_COLOR } = require('../../utils/icons')

Component({
  properties: {
    name: { type: String, value: '' },
    size: { type: Number, value: 44 }, // rpx
    color: { type: String, value: '' } // 空 = --sub 默认色
  },

  data: { src: null },

  observers: {
    'name, color': function (name, color) {
      this.setData({ src: iconDataUri(name, color || DEFAULT_COLOR) })
    }
  }
})
