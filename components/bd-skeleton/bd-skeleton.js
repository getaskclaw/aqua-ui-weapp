// bd-skeleton:列表骨架行(统一 detections/alerts 现有骨架形态),
// 呼吸动画,可选玻璃卡包裹。rows 控制行数。
'use strict'

Component({
  options: { styleIsolation: 'apply-shared' },

  properties: {
    rows: { type: Number, value: 3 },
    card: { type: Boolean, value: true } // 玻璃卡包裹
  },

  data: {
    rowList: [0, 1, 2]
  },

  observers: {
    rows: function (rows) {
      const n = Math.max(1, Number(rows) || 1)
      this.setData({ rowList: Array.from({ length: n }, (_, i) => i) })
    }
  }
})
