// bd-chip:语义徽标——ok/warn/info/neutral(danger 备用),配色取自
// 现有语义 token,浅底深字(户外强光约束)。
'use strict'

Component({
  properties: {
    semantic: { type: String, value: 'neutral' }, // ok | warn | info | neutral | danger
    text: { type: String, value: '' }
  }
})
