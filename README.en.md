# Aqua UI WeApp

A premium native design system for WeChat MiniPrograms. Its Polar Ocean theme combines an airy polar canvas, deep-ocean focal surfaces, and restrained electric aqua—distinctive without compromising real-world readability.

[中文](README.md)

## Runnable showroom

The repository root is a complete MiniProgram with six pages:

- **Overview** presents typography, metrics, ocean cards, and activity rows in a realistic product screen.
- **Basics** demonstrates buttons, surfaces, chips, fields, rows, skeletons, and empty states interactively.
- **Controls** covers identity, data, selection, numeric input, search, and navigation controls.
- **Feedback** covers notices, progress narratives, results, dialogs, and action sheets.
- **Studio** documents the token palette, full icon set, and working photo-upload flow.
- **Extensions** demonstrates the input, layout, selection, media, and commerce components identified by the shop audit.

Import the root folder into WeChat DevTools. The public project uses `touristappid` as a placeholder; replace it in `project.config.json` if your DevTools version does not accept visitor mode.

## Principles

- **Readable glass**: opacity and contrast come before blur.
- **Ocean creates structure**: deep surfaces anchor important information instead of making every screen dark.
- **Aqua signals importance**: vivid cyan is reserved for primary actions and active state.
- **Editorial typography**: strong scale, tighter headings, and deliberate whitespace.
- **Native and small**: WXML, WXSS, and CommonJS only; no runtime dependency or build step.

See [design tokens](docs/design-tokens.md) for the complete palette and usage rules.

Motion uses shared 140–240ms tokens and is limited to state continuity. Overlays have interruptible entrance/exit states, while tabs, segmented controls, and the dock use a single moving indicator. Pass the same `reducedMotion` boolean to `bd-page` and animated components to remove translation and scale; the Feedback page includes a live reduced-motion switch. See the [motion guidelines](docs/motion-guidelines.md) for the full contract.

## Components

Fifty-five reusable native components are included. In addition to the original foundation, the library provides identity, data, selection, feedback, layout, media, popup, picker, and commerce primitives. The shop-driven extension set adds complete inputs, cell groups, generic popups, sidebars, sticky containers, calendars, generic/date-time/region pickers, resilient images, carousels, toasts, product cards, SKU selection, goods actions, and checkout bars.

Copy `components/`, `utils/`, and `styles/tokens.wxss` into an existing MiniProgram, import the tokens once from `app.wxss`, then register the components you use.

`bd-input`, `bd-search`, `bd-slider`, and `bd-tabs` are controlled components: handle their input/change event and write the emitted `value` or `active` key back from the owner. Selection identifiers preserve either string or numeric scalar types. Pass one application-owned `reducedMotion` value to every `bd-page` and to overlay composites so transitions shorten and infinite indicators pause consistently.

```xml
<bd-card tone="ocean" title="Signature surface" subtitle="Put key information here">
  <bd-button shape="pill">Get started</bd-button>
</bd-card>
```

Run the repository checks with `npm test`.

## License

Apache-2.0
