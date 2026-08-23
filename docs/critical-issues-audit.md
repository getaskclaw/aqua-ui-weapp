# Aqua UI WeApp Critical Issues Audit

Audit date: 2026-08-23

Scope: the current `aqua-ui-weapp` working tree, including uncommitted files
Status: original findings with implementation notes added after the motion rollout

## Severity model

- **P0 — Critical:** data loss, security compromise, or a generally unusable application.
- **P1 — High:** release blocker or a defect likely to break an important user flow.
- **P2 — Medium:** material correctness, compatibility, or performance degradation that should be fixed before broad adoption.

No P0 issue was found. The audit found three P1 correctness/release issues, two P2 correctness issues, two high-risk performance issues, and three material performance issues.

## Correctness and release issues

### COR-1 — P1 — Most of version 0.2.0 is not tracked by Git

Before this report was created, the working tree contained 211 untracked files:

- 176 component files
- 24 showroom page files
- `app.js`, `app.json`, `app.wxss`, and `package.json`
- `project.config.json`, `sitemap.json`, and `tests/smoke.js`

Git `HEAD` contains only 11 component definitions and does not contain the runnable showroom, package manifest, or tests. A release from `HEAD`, or a commit made with only `git commit -am`, would omit most of the advertised 55-component implementation.

Evidence: [`app.json`](../app.json), [`package.json`](../package.json), and [`tests/smoke.js`](../tests/smoke.js) are currently untracked.

Recommended action:

1. Review the untracked files as the intended 0.2.0 change set.
2. Stage the complete, reviewed set explicitly.
3. Verify the staged tree in a clean checkout before publishing.

### COR-2 — P1 — Photo persistence failures are silently reported as success

[`bd-photo-uploader.js`](../components/bd-photo-uploader/bd-photo-uploader.js) catches every `copyFileSync` failure and adds the original temporary path to the successful result. A storage-quota or filesystem failure therefore looks successful to the consumer even though the emitted file may disappear after the temporary-file lifecycle ends.

Impact:

- a form can display a successfully selected photo and lose it after restart;
- callers cannot distinguish durable paths from temporary fallback paths;
- retry and user-facing recovery are impossible because the error is suppressed.

Recommended action: reject the affected item or include an explicit persistence error in the result. Do not describe or emit a temporary path as persisted data.

### COR-3 — P1 — SKU confirmation accepts incomplete or stale selections

[`bd-sku-selector.js`](../components/bd-sku-selector/bd-sku-selector.js) always emits `confirm`. It does not verify that every current group has exactly one selected, enabled option. A stale `selected` object can also refer to an option that no longer exists or is now disabled.

Impact: commerce callers can receive an invalid variant payload and add an unavailable or underspecified SKU to the cart.

Recommended action: derive a validity state from the current groups, disable confirmation while invalid, and revalidate immediately before emitting `confirm`.

### COR-4 — P2 — Countdown ignores runtime `autoplay` changes

[`bd-countdown.js`](../components/bd-countdown/bd-countdown.js) restarts its interval only when `seconds` changes. Changing `autoplay` from `true` to `false` leaves an existing timer running; changing it from `false` to `true` does not start the countdown until `seconds` also changes.

Recommended action: observe both `seconds` and `autoplay`, with one timer-lifecycle method responsible for starting and clearing the interval.

### COR-5 — P2 — Radio values are incompatible with numeric identifiers

[`bd-radio.js`](../components/bd-radio/bd-radio.js) declares `value` as `String`, but item values are not normalized. [`bd-radio.wxml`](../components/bd-radio/bd-radio.wxml) then compares the property and item value with strict equality. Numeric IDs can therefore emit from `change` but fail to remain visually selected.

Recommended action: either accept the supported scalar types and preserve them consistently, or normalize both the public value and every item value to strings.

## Critical performance issues

### PERF-1 — P1 — Large photos are copied synchronously on the logic thread

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

### PERF-2 — P1 risk — Fixed, sticky, and full-screen layers stack expensive backdrop filters

At audit time, the design system contained 18 standard `backdrop-filter` declarations. The motion rollout removed full-screen and surface blur from `bd-modal`, `bd-action-sheet`, and `bd-popup`; six standard declarations remain. The main expensive examples are now:

- a fixed dock with `blur(34px) saturate(1.65)` in [`dock.wxss`](../components/dock/dock.wxss);
- a sticky page chrome with `blur(26px) saturate(1.55)` in [`bd-page.wxss`](../components/bd-page/bd-page.wxss);
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

### PERF-3 — P2 — Every icon instance regenerates and transfers an SVG data URI

Each [`bd-icon`](../components/bd-icon/bd-icon.js) observer calls `iconDataUri`. [`utils/icons.js`](../utils/icons.js) rebuilds the SVG string and runs a JavaScript UTF-8/base64 encoder for every `(name, color)` instance. The resulting data URI is then transferred through `setData`. There is no memoization even when lists render the same icon and color repeatedly.

This cost compounds because 21 reusable templates instantiate `bd-icon`, several inside repeated lists such as docks, grids, accordions, actions, and timelines.

Recommended action: memoize data URIs by `name + color`, precompute the default-color registry, and consider packaged static SVG assets for the common icon/color combinations.

### PERF-4 — P2 — All 55 components are registered globally

[`app.json`](../app.json) places every public component in application-level `usingComponents`. This puts every page behind the same 55-component dependency declaration even though each showroom page uses only a subset.

The current component source is about 118.5 KiB, so raw size is not yet a package-limit emergency. The structure nevertheless increases startup parsing and dependency work, prevents a realistic demonstration of page-local adoption, and scales poorly as the library grows.

Recommended action: keep only truly universal primitives global and register the remaining components in each page's JSON. Validate first-screen startup and code-package composition before and after the change.

### PERF-5 — P2 — High-frequency controls duplicate data-bridge updates

Input-like components mutate their own public property with `setData` and then emit an event whose normal consumer also calls `setData`:

- [`bd-input.js`](../components/bd-input/bd-input.js) on every keystroke;
- [`bd-search.js`](../components/bd-search/bd-search.js) on every keystroke;
- [`bd-slider.js`](../components/bd-slider/bd-slider.js) during continuous dragging.

The showroom demonstrates this pattern by immediately writing emitted input and slider values back into page data. This creates two logic-to-view updates for one interaction and can become noticeable in form-heavy pages or while a slider emits continuously.

Recommended action: define a clear controlled/uncontrolled contract. In controlled mode, emit the value and let the owner update it. For continuous slider feedback, throttle visual synchronization to an animation-frame-sized cadence and avoid retransmitting unchanged values.

## Test and measurement gaps

`npm test` currently passes, but [`tests/smoke.js`](../tests/smoke.js) primarily checks parsing, file completeness, component references, showroom coverage, and a few pure helpers. It does not instantiate Mini Program component lifecycles and has no performance assertions.

Before treating the performance findings as resolved, add or record:

- a clean-checkout test to ensure the published tree is complete;
- component tests for countdown property changes and SKU validity;
- uploader timing with one and nine large images;
- first-screen startup timing before and after local component registration;
- scroll and overlay frame profiles with the dock, sticky chrome, cards, and modal layers active;
- icon-render CPU time and `setData` payload size with repeated list icons.

## Recommended remediation order

1. **Make the intended release reproducible:** resolve the untracked implementation and validate a clean checkout.
2. **Protect user data and responsiveness:** replace synchronous photo persistence and expose persistence failures.
3. **Protect transaction correctness:** validate SKU selections before confirmation.
4. **Reduce compositor pressure:** introduce and verify a blur budget on real devices.
5. **Fix component state contracts:** countdown `autoplay` and numeric radio values.
6. **Reduce repeated work:** cache icons, localize component registration, and remove duplicate high-frequency `setData` paths.
