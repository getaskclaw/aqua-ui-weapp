# Polar Ocean 设计令牌

Polar Ocean 的目标不是“更多渐变”，而是用稳定的色彩角色建立层级。玻璃负责空气感，Ocean 负责结构，Aqua 负责信号。

## 核心色谱

| Token | 值 | 角色 |
|---|---:|---|
| `--ocean-950` | `#041724` | 最深焦点面、Aqua 上的文字 |
| `--ocean-900` | `#07283b` | 品牌深色、关键标题 |
| `--ocean-800` | `#0a3a52` | 深色卡片渐变起点 |
| `--ocean-700` | `#0d536b` | 深色辅助层 |
| `--aqua-300` | `#8bf4eb` | 深底高亮、主按钮起点 |
| `--aqua-400` | `#35e3d5` | 品牌 Aqua |
| `--aqua-500` | `#0bc9bd` | 状态和图形强调 |
| `--aqua-600` | `#079e9c` | 浅底小字和图标 |
| `--cyan-500` | `#16b9e6` | Aqua 渐变的冷色端 |

## 表面与文字

| Token | 值 | 角色 |
|---|---:|---|
| `--canvas` | `#edf8f8` | 页面基础画布 |
| `--surface` | `rgba(255,255,255,.82)` | 可读玻璃面 |
| `--surface-solid` | `#f8fdfd` | 高密度内容卡 |
| `--stroke` | `rgba(8,61,79,.10)` | 轻分割线 |
| `--ink` | `#092637` | 主文字 |
| `--ink-2` | `#284b5a` | 正文与次级标题 |
| `--ink-3` | `#607b86` | 辅助信息 |
| `--inverse` | `#f4ffff` | Ocean 表面主文字 |

## 语义色

- `--success: #09845f`
- `--warning: #b45f12`
- `--danger: #c43d4e`
- `--info: #087ca5`

语义色用于信息状态，不参与品牌装饰。错误永远是错误，不能因为主题变化而改成 Aqua。

## 材质纪律

1. 常规正文落在 `surface` 或 `surface-solid`，不直接压复杂渐变。
2. 每屏最多一块大面积 `ocean` 焦点面。
3. Aqua 实色面积保持小；主按钮使用浅 Aqua，并配 Ocean 文字。
4. 默认卡片圆角为 `36rpx`，输入与行项目使用更小一档圆角。
5. 阴影分为低透明大扩散和极轻近场阴影，避免灰脏的厚重悬浮感。

## 动效令牌

| Token | 值 | 用途 |
|---|---:|---|
| `--motion-fast` | `140ms` | 按压、选择和图标反馈 |
| `--motion-standard` | `200ms` | 指示器、披露和小型状态变化 |
| `--motion-overlay` | `240ms` | 对话框、浮层和操作面板 |
| `--ease-aqua` | `cubic-bezier(.2,.8,.2,1)` | 进入和状态连续性 |
| `--ease-aqua-exit` | `cubic-bezier(.4,0,1,1)` | 退出 |

页面根节点添加 `.aqua-reduced-motion` 后，继承的时长会缩短为 `1ms`。有 JavaScript 退出计时的浮层还需要同步传入 `reducedMotion`，完整规则见 [动效规范](motion-guidelines.md)。
