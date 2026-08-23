# Aqua UI WeApp Critical Issues Audit

Audit date: 2026-08-23

Scope: `aqua-ui-weapp` after the remediation pass based on local commit `a2e26e0`
Status: all code-addressable findings resolved; remote publication and real-device profiling remain

## Severity model

- **P0 — Critical:** data loss, security compromise, or a generally unusable application.
- **P1 — High:** release blocker or a defect likely to break an important user flow.
- **P2 — Medium:** material correctness, compatibility, or performance degradation that should be fixed before broad adoption.

No P0 issue was found. The remediation pass resolved the four P1 correctness/release findings, six P2 correctness findings, and all six material P2 performance findings. PERF-1 is resolved in code. PERF-2 is structurally mitigated to one backdrop-filter surface but remains open for real-device verification. COR-1 is resolved in the local tree but remains unpublished until the commits are pushed.

## Remediation status

| Findings | Status | Implemented result |
|---|---|---|
| COR-1 | Resolved locally | All 55 components, six pages, tests, and docs are tracked; push remains |
| COR-2 / PERF-1 | Resolved | Async persistence, concurrency limit of two, explicit failures, teardown cleanup |
| COR-3 | Resolved | SKU selections and quantity are revalidated before confirmation |
| COR-4 / COR-6 | Resolved | Countdown observes autoplay, derives from an absolute deadline, and resyncs on show |
| COR-5 / COR-8 | Resolved | Selection components preserve string and numeric scalar identifiers |
| COR-7 | Resolved | Picker disables and blocks invalid, stale, or disabled confirmation |
| COR-9 | Resolved | Strict calendar parsing rejects normalized dates and follows valid external months |
| COR-10 | Resolved | All page roots receive the app setting; composites forward it; infinite motion pauses |
| COR-11 | Resolved | Source replacement remounts the native image and ignores stale events |
| PERF-2 | Mitigated; profile pending | Backdrop-filter declarations reduced from 13 to the fixed dock only |
| PERF-3 | Resolved | SVG data URIs use a bounded 256-entry cache |
| PERF-4 | Resolved | Only `bd-page` is global; all other components are registered per page |
| PERF-5 | Resolved | Input, search, slider, and tabs use controlled event ownership without duplicate writes |
| PERF-6 | Resolved | Progress fill animates `transform: scaleX()` |
| PERF-7 | Resolved | One transform-driven shimmer replaces per-block gradient repaint loops |
| PERF-8 | Resolved | Tab measurements are coalesced, versioned, and stale callbacks are discarded |

The detailed sections below preserve the original pre-remediation evidence and rationale for traceability. Their status headings and the table above describe the current implementation.

## Correctness and release issues

### COR-1 — Resolved P1 — Most of version 0.2.0 was not tracked by Git

Before the first report was created, the working tree contained 211 untracked files:

- 176 component files
- 24 showroom page files
- `app.js`, `app.json`, `app.wxss`, and `package.json`
- `project.config.json`, `sitemap.json`, and `tests/smoke.js`

Resolution: local commit `a2e26e0` now tracks all 55 component JavaScript entries, all six showroom pages, the package manifest, and the tests. The working tree has no untracked files. The local branch is still one commit ahead of `origin/main`, so the resolution is not available from the remote until that commit is pushed.

Evidence: `git ls-files` reports 55 tracked component JavaScript files and six tracked page JavaScript files; `git ls-files --others --exclude-standard` reports zero files.

Remaining release action: push the reviewed commit and run the smoke suite from a clean checkout of the exact commit intended for publication.

### COR-2 — Resolved P1 — Photo persistence failures were silently reported as success

[`bd-photo-uploader.js`](../components/bd-photo-uploader/bd-photo-uploader.js) catches every `copyFileSync` failure and adds the original temporary path to the successful result. A storage-quota or filesystem failure therefore looks successful to the consumer even though the emitted file may disappear after the temporary-file lifecycle ends.

Impact:

- a form can display a successfully selected photo and lose it after restart;
- callers cannot distinguish durable paths from temporary fallback paths;
- retry and user-facing recovery are impossible because the error is suppressed.

Recommended action: reject the affected item or include an explicit persistence error in the result. Do not describe or emit a temporary path as persisted data.

### COR-3 — Resolved P1 — SKU confirmation accepted incomplete or stale selections

[`bd-sku-selector.js`](../components/bd-sku-selector/bd-sku-selector.js) always emits `confirm`. It does not verify that every current group has exactly one selected, enabled option. A stale `selected` object can also refer to an option that no longer exists or is now disabled.

Impact: commerce callers can receive an invalid variant payload and add an unavailable or underspecified SKU to the cart.

Recommended action: derive a validity state from the current groups, disable confirmation while invalid, and revalidate immediately before emitting `confirm`.

### COR-4 — Resolved P2 — Countdown ignored runtime `autoplay` changes

[`bd-countdown.js`](../components/bd-countdown/bd-countdown.js) restarts its interval only when `seconds` changes. Changing `autoplay` from `true` to `false` leaves an existing timer running; changing it from `false` to `true` does not start the countdown until `seconds` also changes.

Recommended action: observe both `seconds` and `autoplay`, with one timer-lifecycle method responsible for starting and clearing the interval.

### COR-5 — Resolved P2 — Radio values were incompatible with numeric identifiers

[`bd-radio.js`](../components/bd-radio/bd-radio.js) declares `value` as `String`, but item values are not normalized. [`bd-radio.wxml`](../components/bd-radio/bd-radio.wxml) then compares the property and item value with strict equality. Numeric IDs can therefore emit from `change` but fail to remain visually selected.

Recommended action: either accept the supported scalar types and preserve them consistently, or normalize both the public value and every item value to strings.

### COR-6 — Resolved P1 — Countdown duration was tied to interval ticks instead of elapsed time

[`bd-countdown.js`](../components/bd-countdown/bd-countdown.js) subtracts exactly one second on each `setInterval` callback. JavaScript intervals are not a clock: callbacks can be delayed while the logic thread is busy and are commonly throttled or suspended while the Mini Program is backgrounded.

Impact:

- an authentication, payment, reservation, or promotion countdown can finish materially later than the real deadline;
- returning from the background can show a stale remaining duration until enough one-second callbacks run;
- the `finish` event can be emitted late, so business state and the displayed deadline can disagree.

Recommended action: capture an absolute deadline (`Date.now() + remaining * 1000`), derive `remain` from the current time on every render tick, and resynchronize in the component page-lifetime `show` hook. Keep the interval only as a repaint scheduler, not as the source of truth.

### COR-7 — Resolved P2 — Picker confirmation accepted missing, stale, or disabled values

[`bd-picker.js`](../components/bd-picker/bd-picker.js) blocks tapping a disabled option, but `confirm()` always emits. An empty value, a value removed from `options`, or a value that has become disabled produces a confirmation with `item: undefined` or with an option the user is not allowed to choose.

Recommended action: derive a valid draft from the current normalized options, clear or replace stale drafts when options change, disable the confirmation action when no enabled option matches, and revalidate immediately before emitting `confirm`.

### COR-8 — Resolved P2 — Numeric key incompatibility also affected tabs and segmented controls

[`bd-tabs.js`](../components/bd-tabs/bd-tabs.js) and [`bd-segmented.js`](../components/bd-segmented/bd-segmented.js) declare `active` as `String` while preserving item keys and comparing them with strict equality. Numeric keys can therefore be emitted by `change` but fail to remain active when passed back through the public property. This is the same contract defect as COR-5, not an isolated radio issue.

Recommended action: define one scalar-key policy for radio, tabs, segmented controls, sidebar, dock, accordion, picker, and SKU components. Preserve supported scalar types end to end or normalize all public and item keys at the boundary.

### COR-9 — Resolved P2 — Calendar accepted impossible dates and ignored external month changes

[`bd-calendar.js`](../components/bd-calendar/bd-calendar.js) validates only the `YYYY-MM-DD` shape before constructing a `Date`. JavaScript normalizes impossible dates: for example, `2026-02-31` becomes 3 March 2026 while the public value remains `2026-02-31`, leaving the calendar on March with no selected day. In addition, changing `value` externally to a valid date in another month only rebuilds the currently displayed month; it does not navigate to the new value.

Recommended action: round-trip parsed year, month, and day to reject normalization, validate `min` and `max` with the same parser, and decide/document whether an external valid value moves the visible month. If it does, update month and grid atomically.

### COR-10 — Resolved P1 — The advertised reduced-motion path was incomplete

The Feedback page exposes an application-level **减少动态效果** switch, but the setting does not cover the application or all animated components:

- only [`feedback.wxml`](../pages/feedback/feedback.wxml) passes `reducedMotion` to `bd-page`; the other five pages never read the application value;
- `bd-loading`, `bd-skeleton`, and the button, image, and submit spinners use hard-coded infinite animation durations, so inherited motion tokens do not stop them;
- [`bd-picker.wxml`](../components/bd-picker/bd-picker.wxml) and [`bd-sku-selector.wxml`](../components/bd-sku-selector/bd-sku-selector.wxml) do not expose or forward `reducedMotion` to their internal `bd-popup`.

The result contradicts the README and motion-guideline claim that one application boolean can disable translation, scale, and decorative looping motion. It is a release issue for users who explicitly request reduced motion.

Recommended action: make the setting application-owned and apply it to every page root, forward it through composite components, and add reduced-motion styles or static alternatives for all infinite indicators. Loading state must remain understandable without relying on movement.

### COR-11 — Resolved P2 — Stale image events could corrupt the state of a newer source

[`bd-image.js`](../components/bd-image/bd-image.js) resets state when `src` changes, but its `load` and `error` handlers do not verify which source completed. If source A fails after the component has already switched to source B, the stale event sets `failed: true`; the WXML then removes B's native image before it can complete.

Recommended action: associate each rendered image with the current source or a monotonically increasing request token and ignore load/error callbacks that do not match it. Add a rapid A-to-B source-change component test.

## Critical performance issues

### PERF-1 — Resolved P1 — Large photos were copied synchronously on the logic thread

[`bd-photo-uploader.js`](../components/bd-photo-uploader/bd-photo-uploader.js) calls `copyFileSync` inside a loop after media selection. The component permits nine photos of up to 10 MiB each, so a single interaction can synchronously copy a large amount of data before the busy state can render another update.

Impact:

- visible input stalls or an apparently frozen page on slower devices;
- delayed rendering of the busy-state change;
- longer stalls when the filesystem is under pressure;
- the work scales linearly with the number and size of selected photos.

Recommended action:

1. Replace `copyFileSync` with the asynchronous filesystem API.
2. Process files with bounded concurrency rather than one blocking loop or nine unrestricted operations.
3. Report per-file progress or at least yield between files.
4. Measure the flow on representative low-end Android devices with nine near-limit images.

### PERF-2 — Mitigated P1 risk — Fixed, sticky, and full-screen layers stacked expensive backdrop filters

At second-pass audit time, the design system contained 13 standard `backdrop-filter` declarations across 12 WXSS files. The remediation leaves one declaration: the fixed dock. Cards, page chrome, buttons, search, tooltips, FAB, cell groups, goods actions, submit bars, and the generic glass utility now use opaque or near-opaque surfaces without live blur.

- a fixed dock with `blur(34px) saturate(1.65)` in [`dock.wxss`](../components/dock/dock.wxss);
- a sticky page chrome with `blur(26px) saturate(1.55)` in [`bd-page.wxss`](../components/bd-page/bd-page.wxss);
- optionally fixed goods-action, submit-bar, and FAB surfaces with blur;
- blurred cards and buttons that can appear below the fixed and sticky layers.

When these surfaces overlap or move during scrolling, the compositor must repeatedly sample and blur changing content across large areas. This is a high risk for frame drops, excess GPU work, and battery drain on lower-end devices. The current smoke test cannot detect rendering cost.

Recommended action:

1. Establish a blur budget of at most one large moving glass surface per viewport.
2. ~~Replace full-screen overlay blur with a solid translucent scrim.~~ Completed in the motion rollout.
3. Prefer opaque or near-opaque backgrounds for scrolling cards and controls.
4. Reserve backdrop blur for the dock or chrome, not both simultaneously on constrained devices.
5. Capture frame time, raster/compositor cost, and dropped-frame data on real iOS and low-end Android hardware before release.

Any animation work should follow the budgets and accessibility rules in the [Aqua UI motion guidelines](motion-guidelines.md).

## Additional material performance issues

### PERF-3 — Resolved P2 — Every icon instance regenerated and transferred an SVG data URI

Each [`bd-icon`](../components/bd-icon/bd-icon.js) observer calls `iconDataUri`. [`utils/icons.js`](../utils/icons.js) rebuilds the SVG string and runs a JavaScript UTF-8/base64 encoder for every `(name, color)` instance. The resulting data URI is then transferred through `setData`. There is no memoization even when lists render the same icon and color repeatedly.

This cost compounds because 21 reusable templates instantiate `bd-icon`, several inside repeated lists such as docks, grids, accordions, actions, and timelines.

Recommended action: memoize data URIs by `name + color`, precompute the default-color registry, and consider packaged static SVG assets for the common icon/color combinations.

### PERF-4 — Resolved P2 — All 55 components were registered globally

[`app.json`](../app.json) places every public component in application-level `usingComponents`. This puts every page behind the same 55-component dependency declaration even though each showroom page uses only a subset.

The current component source is about 118.5 KiB, so raw size is not yet a package-limit emergency. The structure nevertheless increases startup parsing and dependency work, prevents a realistic demonstration of page-local adoption, and scales poorly as the library grows.

Recommended action: keep only truly universal primitives global and register the remaining components in each page's JSON. Validate first-screen startup and code-package composition before and after the change.

### PERF-5 — Resolved P2 — High-frequency controls duplicated data-bridge updates

Input-like components mutate their own public property with `setData` and then emit an event whose normal consumer also calls `setData`:

- [`bd-input.js`](../components/bd-input/bd-input.js) on every keystroke;
- [`bd-search.js`](../components/bd-search/bd-search.js) on every keystroke;
- [`bd-slider.js`](../components/bd-slider/bd-slider.js) during continuous dragging.

The showroom demonstrates this pattern by immediately writing emitted input and slider values back into page data. This creates two logic-to-view updates for one interaction and can become noticeable in form-heavy pages or while a slider emits continuously.

Recommended action: define a clear controlled/uncontrolled contract. In controlled mode, emit the value and let the owner update it. For continuous slider feedback, throttle visual synchronization to an animation-frame-sized cadence and avoid retransmitting unchanged values.

### PERF-6 — Resolved P2 — Progress animated layout width on every value change

[`bd-progress.wxss`](../components/bd-progress/bd-progress.wxss) transitions the fill's `width` for 240 ms. This contradicts the motion guideline's own rule to avoid layout dimensions when a transform can express the same change. Repeated progress updates can trigger layout and paint work instead of staying on the compositor path.

Recommended action: keep the fill at full width, set `transform-origin: left`, and animate `scaleX(percent / 100)`. Disable or shorten the transition through the shared reduced-motion token.

### PERF-7 — Resolved P2 — Skeletons continuously repainted multiple moving gradients

Each [`bd-skeleton`](../components/bd-skeleton/bd-skeleton.wxss) row creates three blocks whose gradient `background-position` animates forever. The default three-row skeleton therefore runs nine paint-heavy animations, often inside the generic blurred `.glass` surface. Larger row counts scale the work linearly, and the reduced-motion setting does not stop it.

Recommended action: prefer one pseudo-element shimmer for the whole skeleton, animate a compositor-friendly transform, cap rendered rows, and provide a static reduced-motion state. Profile raster and battery cost with realistic loading lists rather than a single showroom card.

### PERF-8 — Resolved P2 — Tabs forced duplicate layout measurement and could apply stale results

[`bd-tabs.js`](../components/bd-tabs/bd-tabs.js) runs `createSelectorQuery().boundingClientRect()` whenever `items`, `active`, or `centered` changes, then transfers a new inline style. A normal controlled tap can schedule the work once for the component's internal `setData` and again when the owner writes the emitted key back. There is no request generation check, so an older asynchronous measurement can overwrite the indicator produced for a newer active item.

Impact:

- selection causes avoidable logic-to-render round trips and forced geometry reads;
- rapid changes can leave the indicator under the wrong tab;
- font, viewport, or content-size changes can leave cached geometry stale until one of the observed properties changes.

Recommended action: coalesce measurement to one pending task, attach a generation/version token, discard stale callbacks, and avoid the internal active write in controlled mode. Re-measure only for actual geometry changes.

## Test and measurement gaps

`npm test` currently passes. [`tests/smoke.js`](../tests/smoke.js) now covers syntax and references plus mocked state transitions for overlays, countdown deadlines/autoplay, picker and SKU validity, scalar identifiers, stale image events, stale tab measurements, asynchronous uploader concurrency, cache behavior, local registration, the blur budget, compositor-friendly progress/skeleton motion, and application-wide reduced motion.

The remaining gaps require a clean release checkout or the real Mini Program runtime:

- a clean-checkout test to ensure the published tree is complete;
- uploader timing with one and nine large images;
- first-screen startup timing before and after local component registration;
- scroll and overlay frame profiles with the dock, sticky chrome, cards, and modal layers active;
- icon-render CPU time and `setData` payload size with repeated list icons;
- raster/frame profiles for progress updates and multi-row skeletons.

## Remaining release work

1. Commit and push the remediation, then run `npm test` from a clean checkout of the exact release revision.
2. Compile and exercise the showroom in WeChat DevTools, including uploader failures and page-to-page reduced-motion persistence.
3. Profile upload, startup, scrolling, overlays, repeated icons, progress, and skeletons on representative iOS and lower-end Android devices.
4. Publish only after the real-device measurements satisfy the motion acceptance criteria.
