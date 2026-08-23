# Aqua Shop UI Coverage Audit

This document compares the reusable UI in `aqua-ui-weapp` with the UI actually rendered by `aqua-shop-weapp`. Counts were taken from first-party WXML only; generated dependencies under `node_modules` and `miniprogram_npm` were excluded.

## Current Aqua adoption

The shop applies Aqua design tokens, glass surfaces, mesh backgrounds, and the custom glass dock broadly. Component adoption is narrower:

| Aqua element | Shop usage |
|---|---:|
| `bd-empty-state` | 4 screens |
| `bd-chip` | 5 instances across 2 screens |
| `bd-icon` | Custom tab bar and internal Aqua components |
| `bd-button` | Internal dependency of `bd-empty-state` |

The shop vendors ten Aqua components. `bd-card`, `bd-field`, `bd-list-row`, `bd-page`, `bd-photo-uploader`, and `bd-skeleton` are present but have no application-level WXML usage.

## Existing Aqua alternatives not yet adopted

| Shop element | Usage | Aqua alternative |
|---|---:|---|
| `van-icon` | 87 occurrences / 26 files | `bd-icon` |
| `van-button` | 59 / 30 | `bd-button` |
| `van-empty` | 25 / 23 | `bd-empty-state` |
| `van-tab` + `van-tabs` | 16 items / 12 containers | `bd-tabs` |
| `van-radio` | 15 / 5 | `bd-radio` |
| `van-stepper` | 11 / 8 | `bd-stepper` |
| `van-rate` | 8 / 7 | `bd-rate` |
| `van-uploader` | 5 / 4 | `bd-photo-uploader` |
| `van-search` | 4 / 4 | `bd-search` |
| `van-loading` | 3 / 3 | `bd-loading` |
| `van-divider` | 3 / 3 | `bd-divider` |
| `van-notice-bar` | 2 / 2 | `bd-notice` |
| `van-progress` | 2 / 2 | `bd-progress` |
| `van-count-down` | 2 / 1 | `bd-countdown` |
| `van-switch` | 1 / 1 | `bd-switch` |
| `van-grid` | 1 / 1 | `bd-grid` |
| `van-action-sheet` | 1 / 1 | `bd-action-sheet` |
| `van-checkbox` | 1 / 1 | `bd-check` |

These are migration candidates, not drop-in replacements. Event names, properties, slots, and controlled-state behavior must be adapted deliberately.

## Partial coverage

| Shop element | Usage | Gap |
|---|---:|---|
| `van-cell` / `van-cell-group` | 154 cells / 43 groups | The original `bd-list-row` lacks grouping and richer cell structure |
| `van-field` | 47 / 19 files | The original `bd-field` is a label and error shell, not a complete input |
| `van-popup` | 22 / 14 | Modal and action sheet do not cover a generic positioned popup |
| `van-card` | 15 / 12 | `bd-card` is a surface, not a product card with media and price |

## General-purpose gaps added to Aqua UI

The audit resulted in these reusable additions:

- `bd-input` — complete single-line and multiline input
- `bd-cell-group` — grouped list surface
- `bd-popup` — center, top, and bottom overlays
- `bd-sidebar` — vertical category navigation
- `bd-sticky` — sticky content wrapper
- `bd-calendar` — controlled monthly date selection
- `bd-picker` — generic option picker
- `bd-datetime-picker` — native date and time input
- `bd-region-picker` — native region selection
- `bd-image` — loading and failure-aware media
- `bd-carousel` — image and content carousel
- `bd-toast` and `utils/toast.js` — consistent transient feedback

## Commerce gaps added to Aqua UI

- `bd-product-card` — product image, price, metadata, tag, and action
- `bd-sku-selector` — option groups, quantity, and confirmation
- `bd-goods-action` — product-detail action dock
- `bd-submit-bar` — order total and primary checkout action

## Deliberately shop-specific

The following remain in `aqua-shop-weapp` because they combine presentation with application APIs and business state:

- Payment orchestration
- Mobile-number binding and authentication
- Account profile completion
- Privacy-agreement persistence
- VIP purchase success handling
- Poster generation and rich HTML rendering
- Live-streaming and video-call controls

Their visual shells can use Aqua primitives, but their business logic should not be moved into the design system.

## Feedback API signal

The shop currently calls `wx.showToast` 316 times, `wx.showModal` 129 times, and `wx.showLoading` 68 times. `bd-toast` and its helper provide the first reusable migration path. Modal and loading service helpers remain potential follow-up work if the shop needs a fully imperative feedback layer.
