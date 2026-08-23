# Aqua Glass WeApp

A zero-dependency WeChat MiniProgram component library with a light Liquid Glass aesthetic — frosted-glass cards, aqua gradient mesh backgrounds, and a floating capsule dock. Pure WXML Components: no Tailwind, no build step, copy `components/` and go.

Design principles (colors chosen by measured WCAG contrast, not taste):

- **Sunlight constraint**: content areas always light-background with dark ink (field/boat use cases)
- **Bright aqua in a cage**: `#13ecf3` only ever sits on navy `#162455` (1.6:1 on white = broken, 12:1 on navy = stunning)
- **Stable semantics**: confirm-green / action-orange / danger-red stay consistent across clients

## Status

🚧 Incubating. Components are being proven inside its first consumer app (the BDeeper fisher-report MiniProgram); v0.1 will be extracted once the kitchen-sink showcase passes visual acceptance.

[中文 README](README.md)

## License

Apache-2.0
