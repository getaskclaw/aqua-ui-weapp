# 示例:电商小程序(demo/)

微信小程序最大类目就是电商(商城/购物)——商品网格、详情、购物车、订单确认,恰好用遍本库全部组件,是最佳试炼场。

## 规划页面

- `pages/index` — 商品网格(bd-card + bd-chip + 下拉刷新 + bd-skeleton)
- `pages/detail` — 商品详情(玻璃卡层级 + bd-button 主/次)
- `pages/cart` — 购物车(bd-list-row + 数量步进 + 空态 bd-empty-state)
- `pages/confirm` — 订单确认(bd-field + 价格行 + 主 CTA)
- 底部悬浮 dock:首页/分类/购物车/我的(bd-dock)

## 状态

🚧 组件在首个消费方应用内验证中(WO-011),v0.1 抽出入仓后本目录即落地为可运行示例。
