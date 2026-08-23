# Aqua UI WeApp Motion Guidelines

Status: implementation complete; real-device profiling remains
Updated: 2026-08-23

## Decision

Add motion selectively. Aqua UI benefits from responsive feedback and continuity between states, but it does not need decorative animation throughout the interface.

The intended character is **responsive motion, not constant motion**:

- motion explains a state change, action, or spatial relationship;
- frequently repeated interactions remain nearly immediate;
- content stays stable while controls provide feedback;
- animation never becomes the only indication that something changed;
- users can continue interacting without waiting for an animation to finish.

This follows Apple's Liquid Glass direction: the material is dynamic, but should be concentrated in controls and navigation, applied sparingly, and paired with purposeful, brief, optional motion. See Apple's [Liquid Glass overview](https://developer.apple.com/documentation/technologyoverviews/liquid-glass), [Motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion), and [Materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials).

## Implementation status

The codebase implements the core of the first five rollout stages:

- shared duration and easing tokens live in `styles/tokens.wxss`;
- `.aqua-reduced-motion` shortens inherited token-based transitions, and the primary overlay/selection components expose a `reducedMotion` property;
- `bd-modal`, `bd-popup`, and `bd-action-sheet` keep an internal presentation state for interruptible entrance and exit motion;
- `bd-tabs`, `bd-segmented`, and `bd-dock` use one transform-driven selection indicator;
- `bd-accordion`, `bd-result`, and `bd-photo-uploader` provide restrained state feedback;
- all `transition: all` declarations have been replaced with explicit property lists;
- the animated overlays use solid translucent scrims and near-opaque surfaces instead of live backdrop blur.

The Feedback showroom page includes a **减少动态效果** switch backed by one application-owned value. Every page root reads that value, popup-based composites forward it, and infinite loading/skeleton indicators pause through `--motion-play-state`. Automated tests cover overlay reversal and dismissal, page/composite propagation, and infinite-animation coverage. Real-device compositor profiling is still required before release.

## Current baseline

Aqua UI already includes useful motion:

- 140–180 ms press and selection transitions on buttons, cards, list rows, switches, checks, radios, and the dock;
- a transform-driven 200 ms progress transition;
- accordion-arrow rotation;
- loading, image-loading, submit, and skeleton indicators.

Progress uses `scaleX`, and the skeleton uses one transform-driven shimmer for the complete surface instead of one repainting gradient per block. The code baseline is ready for device profiling; see PERF-6 and PERF-7 in the [critical issues audit](critical-issues-audit.md).

## Recommended additions

### 1. Overlays

Add coordinated entrance and exit motion to:

- `bd-modal`
- `bd-popup`
- `bd-action-sheet`

Use opacity on the scrim and either a small scale or short vertical translation on the surface. Keep the total duration between 180 and 240 ms.

Exit animation requires a short internal presentation state. Do not remove the WXML subtree immediately when the public `visible` property becomes false; finish the exit transition first, without preventing the caller from continuing other work.

### 2. Selection continuity

For `bd-tabs`, `bd-segmented`, and `bd-dock`, prefer one moving highlight or indicator over independently animating the background, border, and shadow of every item.

Animate the indicator with `transform`. Keep text and icons stable except for a brief color change.

### 3. Disclosure

For `bd-accordion`, keep the existing arrow rotation and add a restrained opacity/translation transition to newly revealed content. Avoid expensive JavaScript-driven height animation for large or dynamic content.

### 4. Completion and status

Use one short entrance animation for `bd-result`, confirmation states, and newly completed progress. The animation should run once per meaningful state transition, not loop.

### 5. Upload feedback

Smooth the transition into and out of the `bd-photo-uploader` busy state. This does not replace the required performance fix: synchronous file copying must still be removed as described in the [critical issues audit](critical-issues-audit.md).

## Motion tokens

Use a small shared motion vocabulary:

| Token | Suggested value | Use |
|---|---:|---|
| `--motion-fast` | `140ms` | Press, check, radio, icon response |
| `--motion-standard` | `200ms` | Selection and small state changes |
| `--motion-overlay` | `240ms` | Modal, popup, and sheet transitions |
| `--ease-aqua` | `cubic-bezier(.2,.8,.2,1)` | Default entrance and state easing |
| `--ease-aqua-exit` | `cubic-bezier(.4,0,1,1)` | Short exit easing |

Durations are a budget, not a target to exceed. A transition that reads clearly at 140 ms should not be stretched to 240 ms.

## Performance rules

Prefer animating:

- `transform`
- `opacity`
- narrowly scoped foreground colors

Avoid animating:

- `backdrop-filter` or blur radius;
- `box-shadow` on large or moving surfaces;
- gradients and the page mesh;
- large-area border radius changes;
- layout dimensions such as `width`, `height`, `top`, or `left` when a transform can express the same movement;
- every property through `transition: all`.

Replace existing `transition: all` declarations with explicit property lists before expanding the motion system.

Aqua UI now retains one standard `backdrop-filter` declaration on the fixed dock. Other glass surfaces use opaque or near-opaque fills. Do not add another large live-blur surface until real-device profiling establishes a safe compositor budget. Details are in [PERF-2 of the critical issues audit](critical-issues-audit.md).

## Accessibility and user control

Custom WeChat components do not automatically receive the adaptive motion behavior that Apple system components provide. Aqua UI should expose a library- or application-level reduced-motion setting.

With reduced motion enabled:

- preserve immediate color and visibility changes;
- remove translation, scale, parallax, and decorative looping motion;
- replace overlay movement with a very short fade or no transition;
- keep progress and loading information understandable without animation;
- never use motion as the only success, error, selection, or navigation signal.

Reduced transparency should be treated separately: replace glass surfaces with more opaque backgrounds instead of merely disabling animation.

Use one application-owned boolean and pass it to the page root and animated components:

```xml
<bd-page reducedMotion="{{reducedMotion}}">
  <bd-modal visible="{{modalVisible}}" reducedMotion="{{reducedMotion}}" />
</bd-page>
```

`bd-page` applies `.aqua-reduced-motion` to shorten inherited CSS transitions. Overlay components also need the property so their JavaScript presentation timer can dismiss immediately rather than waiting for an exit transition that the user has disabled.

## Patterns to avoid

Do not add:

- moving mesh or gradient backgrounds;
- continuous floating, glowing, breathing, or liquid-wobble effects;
- long page-entry sequences;
- staggered animation for ordinary lists;
- scroll-linked parallax;
- spring or bounce motion on routine commerce actions;
- an animation that delays navigation, confirmation, or dismissal;
- literal attempts to reproduce Apple's optical glass morphing with animated WXSS blur.

## Rollout order

1. Define shared motion tokens and reduced-motion behavior.
2. Replace `transition: all` with explicit properties.
3. Add overlay entrance and exit transitions.
4. Add transform-based selection indicators.
5. Add disclosure and one-time completion feedback.
6. Profile on real iOS and lower-end Android devices.
7. Retain only animations that remain clear and smooth under the performance budget.

## Acceptance criteria

Motion is ready for release when:

- interaction remains available during transitions;
- no routine transition exceeds 240 ms;
- no new animation changes blur radius or another large-area paint effect;
- reduced-motion mode communicates every state correctly;
- overlay and scrolling profiles show no material increase in dropped frames;
- rapid repeated taps cannot leave a component in an intermediate visual state;
- component tests cover interrupted, reversed, and repeated visibility changes.
