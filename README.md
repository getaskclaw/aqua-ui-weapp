# Aqua UI WeApp

面向微信小程序原生开发的高质感设计系统。Polar Ocean 主题将通透浅色画布、深海焦点面与克制的荧光水色组合在一起：有视觉辨识度，也保持真实业务所需的清晰度。

[English](README.en.md)

## 现在可以直接运行

仓库根目录就是完整的微信小程序项目，包含六个可运行页面：

- **概览**：以真实产品首页展示排版、指标、深色焦点卡和信息列表
- **基础**：交互式陈列按钮、卡片、标签、表单、列表、骨架和空态
- **控件**：身份、数据、选择、数值、搜索和页签等十七种交互组件
- **反馈**：提醒、步骤、时间线、结果、对话框和操作面板等十一种反馈组件
- **规范**：设计令牌、完整图标集和真实照片上传流程
- **扩展**：商城审计补全的输入、布局、选择、媒体与交易组件

用微信开发者工具导入本目录即可预览。公仓使用 `touristappid` 占位；如果当前工具版本不接受游客模式，请先在 `project.config.json` 换成自己的 AppID。

## 设计方向

- **阅读优先的玻璃**：提高面板不透明度，只在层级需要时使用模糊与透光
- **Ocean 建立秩序**：深海色承载关键数据和品牌时刻，而不是把整页染黑
- **Aqua 点亮重点**：高亮青只用于主操作、当前状态和小面积品牌信号
- **编辑式排版**：更明确的字号跨度、紧凑标题字距和充足的段落留白
- **原生且轻量**：纯 WXML、WXSS、CommonJS；零运行时依赖、零构建步骤

完整色值和使用规则见 [设计令牌](docs/design-tokens.md)。

动效使用 140–240ms 的共享令牌，只作用于状态连续性。浮层支持可中断的进出场，页签、分段控件和 dock 使用单一移动指示器。将同一个 `reducedMotion` 布尔值传给 `bd-page` 和相关动效组件即可关闭位移与缩放；反馈页提供可直接体验的“减少动态效果”开关。完整规则见 [动效规范](docs/motion-guidelines.md)。

## 组件

| 组件 | 能力 |
|---|---|
| `bd-page` | 渐变画布、自定义安全区 chrome、内容留白和 dock 空间 |
| `bd-button` | primary / ghost / danger，lg / md，soft / pill，loading / disabled |
| `bd-card` | glass / solid / tint / ocean 四种表面，标题、副标题和交互态 |
| `bd-list-row` | 图标井、主副标题、状态槽、箭头与按压反馈 |
| `bd-chip` | ok / warn / info / neutral / danger，可选状态点 |
| `bd-icon` | 34+ 个统一线性 SVG 图标，颜色和尺寸可控 |
| `bd-empty-state` | 无数据、未绑定、404、错误四种恢复场景 |
| `bd-field` | 标签、必填、提示和错误信息的表单外壳 |
| `bd-photo-uploader` | 选择、压缩、持久化、预览、删除和 9 图上限 |
| `bd-skeleton` | 流光式列表骨架，可选卡片表面 |
| `bd-dock` | 3–5 项可配置悬浮导航，不再绑定任何业务路由 |
| `bd-avatar` | 图片、文字、默认图标、圆形或圆角外观及在线状态 |
| `bd-badge` | 数字、上限、圆点和五种语义色，可包裹任意内容 |
| `bd-divider` | 居左、居中、居右及虚线分隔 |
| `bd-progress` | 数值换算、标签、尺寸和语义状态 |
| `bd-stat` | 指标、趋势、说明、图标及浅色或深海表面 |
| `bd-grid` | 可配置列数、图标入口和选择事件 |
| `bd-switch` | 标签、说明、尺寸、禁用态和变更事件 |
| `bd-check` | 方形或圆形多选、说明和禁用态 |
| `bd-radio` | 横向或纵向单选组、逐项禁用和变更事件 |
| `bd-stepper` | 最小值、最大值、步长和数值边界 |
| `bd-search` | 输入、清除、提交、禁用和自定义占位 |
| `bd-tabs` | 横向滚动页签、徽标、禁用和当前项 |
| `bd-segmented` | 等宽分段切换、对象或文本数据源 |
| `bd-slider` | 原生滑块封装、步长、范围和实时反馈 |
| `bd-rate` | 星级评分、数量、尺寸和只读状态 |
| `bd-pagination` | 上一页、下一页、边界控制和当前页事件 |
| `bd-notice` | 轻量消息、语义色、操作入口和关闭能力 |
| `bd-alert` | 标题、说明、图标、语义状态和关闭能力 |
| `bd-accordion` | 单开或多开折叠面板、禁用和受控状态 |
| `bd-steps` | 横向或纵向步骤、完成态和当前态 |
| `bd-timeline` | 时间、说明和语义节点组成的事件流 |
| `bd-loading` | 圆环或圆点加载、横向或纵向排布 |
| `bd-result` | 成功、警告、错误、空态和后续操作 |
| `bd-modal` | 蒙层、插槽、确认、取消和点击蒙层关闭 |
| `bd-action-sheet` | 底部操作面板、说明、危险项和禁用项 |
| `bd-tooltip` | 上下方轻提示及受控显示 |
| `bd-countdown` | 时分秒格式、自动计时、变化和结束事件 |
| `bd-fab` | 左右定位、图标、文字、禁用和按压反馈 |
| `bd-input` | 单行、多行、清空、禁用、提示和错误状态 |
| `bd-cell-group` | 带标题、说明和表面层级的列表分组 |
| `bd-popup` | 居中、顶部或底部通用浮层 |
| `bd-sidebar` | 分类导航、徽标、禁用和受控选中态 |
| `bd-sticky` | 可配置偏移与层级的吸顶容器 |
| `bd-calendar` | 月份浏览、日期范围和受控单选 |
| `bd-picker` | 通用选项选择、预览和确认 |
| `bd-datetime-picker` | 原生日期与时间组合输入 |
| `bd-region-picker` | 原生省市区选择与地区代码事件 |
| `bd-image` | 图片加载、失败占位、懒加载和圆角 |
| `bd-carousel` | 图片轮播、说明文字和受控页码 |
| `bd-toast` | 语义轻提示、位置、遮罩和辅助调用函数 |
| `bd-product-card` | 商品图片、价格、标签、说明和操作 |
| `bd-sku-selector` | 多组规格、数量边界和确认事件 |
| `bd-goods-action` | 商品详情快捷入口与双层购买操作 |
| `bd-submit-bar` | 合计金额、说明、加载和提交状态 |

## 在现有小程序中使用

1. 复制 `components/`、`utils/` 和 `styles/tokens.wxss`。
2. 在 `app.wxss` 顶部加入 `@import "styles/tokens.wxss";`。
3. 在页面或 `app.json` 注册需要的组件。

```json
{
  "usingComponents": {
    "bd-card": "/components/bd-card/bd-card",
    "bd-button": "/components/bd-button/bd-button"
  }
}
```

```xml
<bd-card tone="ocean" title="旗舰焦点" subtitle="重要信息放在这里">
  <bd-button shape="pill">立即开始</bd-button>
</bd-card>
```

悬浮导航由使用方提供路由，不包含应用特定逻辑：

```xml
<bd-dock active="home" navItems="{{navItems}}" />
```

每项格式为 `{ key, label, icon, url }`，最多显示五项。

`bd-input`、`bd-search`、`bd-slider` 和 `bd-tabs` 采用受控状态：组件只发送输入或选择事件，使用方在事件处理器中更新传入的 `value` / `active`。这样可以避免一次交互产生两次逻辑层到视图层更新。单选、页签、分段、侧边栏和 dock 的标识符均原样保留字符串或数字类型。

## 验证

```sh
npm test
```

测试覆盖 JSON/JavaScript 语法、组件文件完整性、页面可运行性、组件引用、陈列覆盖率、核心逻辑和主题令牌。

## License

Apache-2.0
