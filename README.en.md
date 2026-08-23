# Aqua UI WeApp

A zero-dependency WeChat MiniProgram component library with a light Liquid Glass aesthetic — frosted-glass cards, aqua gradient mesh backgrounds, and a floating capsule dock. Pure WXML Components: no Tailwind, no build step — copy `components/` + `styles/tokens.wxss` and go.

Design principles (colors chosen by measured WCAG contrast, not taste):

- **Sunlight constraint**: content areas always light-background with dark ink (field/boat use cases)
- **Bright aqua in a cage**: `#13ecf3` only ever sits on navy `#162455` (1.6:1 on white = broken, 12:1 on navy = stunning)
- **Stable semantics**: confirm-green / action-orange / danger-red stay consistent across clients

## Quick start

1. Copy `components/` into your MiniProgram root, and `@import` (or merge) `styles/tokens.wxss` at the top of `app.wxss`
2. Declare components in page JSON, e.g. `"usingComponents": {"bd-card": "/components/bd-card/bd-card"}`
3. Apply `.mesh` to the page root; use `<bd-card>` or `.glass` for cards

## Components (11)

| Component | Purpose |
|---|---|
| bd-page | mesh background + safe area + optional navy chrome slot |
| bd-button | primary (aqua gradient) / ghost (glass outline) / danger (de-escalated outline); loading/disabled; lg/md |
| bd-card | glass card; padding normal/compact/flush; title prop or named slot |
| bd-list-row | icon + title/desc + status slot; pressed state |
| bd-chip | semantic badges (ok/warn/info/neutral/danger) |
| bd-icon | 14-name inline SVG set (fish/camera/warn/home/plus/user/grid/list/flag/chevron/check/empty-doc/location/clock) |
| bd-empty-state | four empty scenes (no-data/unbound/404/error); icon+title+desc+optional action |
| bd-field | form field: label + required star + control slot + hint/error |
| bd-photo-uploader | dashed frame + camera icon + counter + 3×3 preview + delete + disabled-full state |
| bd-skeleton | list skeleton rows (row count, card-wrapped or bare) |
| dock | floating capsule navigation; identity-driven items; active pill |

## Design tokens

All colors with measured WCAG contrast: [docs/design-tokens.md](docs/design-tokens.md).

## Demo

`demo/` — e-commerce MiniProgram example (the largest MiniProgram category), landing progressively; live proving ground: [aqua-shop-weapp](https://github.com/getaskclaw/aqua-shop-weapp).

[中文 README](README.md)

## License

Apache-2.0
