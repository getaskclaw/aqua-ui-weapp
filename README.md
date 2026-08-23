# Aqua Glass WeApp

Liquid Glass 浅底版微信小程序原生组件库 —— 零依赖、零构建、纯 WXML Component。

[English README](README.en.md)

## 这是什么

一套为微信小程序原生环境(WXML/WXSS)写的组件库:磨砂玻璃卡片、弥散渐变水底、悬浮胶囊导航。不依赖 Tailwind、不需要构建链,拷贝 `components/` 即可用。

设计原则(实测对比度定色,非拍脑袋):

- **户外强光约束**:内容区永远浅底深字(田间/船头场景)
- **亮青关在笼子里**:`#13ecf3` 只许出现在藏青 `#162455` 底上(压白底 1.6:1 残废,压藏青 12:1)
- **语义色稳定**:确认绿/待办橙/危险红跨端一致

## 状态

🚧 孵化中。组件正随首个用户项目(BDeeper 协作上报小程序)在应用内验证;kitchen sink 陈列室验证完成后抽出为 v0.1。

## 设计令牌

见 [docs/design-tokens.md](docs/design-tokens.md) —— 全部色值附带实测 WCAG 对比度。

## License

Apache-2.0
