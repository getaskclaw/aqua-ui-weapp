'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { createRequire } = require('node:module')

const ROOT = path.resolve(__dirname, '..')
const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'))
const COMPONENTS = fs.readdirSync(path.join(ROOT, 'components'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(ROOT, 'components', entry.name, entry.name + '.js')))
  .map((entry) => entry.name)
  .sort()
const pageConfigs = Object.fromEntries(app.pages.map((page) => [page, JSON.parse(fs.readFileSync(path.join(ROOT, page + '.json'), 'utf8'))]))
const PUBLIC_TAGS = new Set([
  ...Object.keys(app.usingComponents || {}),
  ...Object.values(pageConfigs).flatMap((config) => Object.keys(config.usingComponents || {}))
])

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return []
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function pass(message) {
  console.log(`PASS  ${message}`)
}

const files = walk(ROOT)
for (const file of files.filter((item) => item.endsWith('.json'))) {
  JSON.parse(fs.readFileSync(file, 'utf8'))
}
pass('all JSON files parse')

for (const file of files.filter((item) => item.endsWith('.wxml'))) {
  const rawSource = fs.readFileSync(file, 'utf8')
  const relative = path.relative(ROOT, file)
  assert.doesNotMatch(rawSource, /<br\s*\/?\s*>/i, `${relative} uses unsupported <br>; use nested views instead`)
  assert.doesNotMatch(rawSource, /="[^"]*<[^"]*"/, `${relative} has an unescaped < inside an attribute`)

  const source = rawSource
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/="[^"]*"/g, '=""')
  const stack = []
  const tags = source.matchAll(/<\/?([a-zA-Z][\w-]*)(?:\s[^<>]*?)?\s*\/?>/g)
  for (const match of tags) {
    const token = match[0]
    const name = match[1]
    if (token.startsWith('</')) {
      assert.equal(stack.pop(), name, `${path.relative(ROOT, file)} has an unbalanced </${name}>`)
    } else if (!token.endsWith('/>')) {
      stack.push(name)
    }
  }
  assert.deepEqual(stack, [], `${path.relative(ROOT, file)} has unclosed tags: ${stack.join(', ')}`)
}
pass('all WXML templates avoid unsupported syntax and have balanced tags')

for (const file of files.filter((item) => item.endsWith('.js'))) {
  new vm.Script(fs.readFileSync(file, 'utf8'), { filename: file })
}
pass('all JavaScript files compile')

for (const name of COMPONENTS) {
  const base = path.join(ROOT, 'components', name, name)
  for (const ext of ['.js', '.json', '.wxml', '.wxss']) {
    assert.ok(fs.existsSync(base + ext), `${name}${ext} is missing`)
  }
}
pass(COMPONENTS.length + ' components contain complete native file sets')

for (const page of app.pages) {
  for (const ext of ['.js', '.json', '.wxml', '.wxss']) {
    assert.ok(fs.existsSync(path.join(ROOT, page + ext)), `${page}${ext} is missing`)
  }
}
pass(`${app.pages.length} showroom pages are runnable`)

for (const [name, componentPath] of Object.entries(app.usingComponents)) {
  const base = path.join(ROOT, componentPath.replace(/^\//, ''))
  assert.ok(fs.existsSync(base + '.json'), `${name} cannot resolve ${componentPath}`)
}
pass('global component references resolve')

for (const file of files.filter((item) => item.endsWith('.json'))) {
  const config = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const [name, componentPath] of Object.entries(config.usingComponents || {})) {
    const base = componentPath.startsWith('/')
      ? path.join(ROOT, componentPath.slice(1))
      : path.resolve(path.dirname(file), componentPath)
    assert.ok(fs.existsSync(base + '.json'), `${path.relative(ROOT, file)}: ${name} cannot resolve ${componentPath}`)
  }
}
pass('nested component references resolve')

const showroom = app.pages.map((page) => fs.readFileSync(path.join(ROOT, page + '.wxml'), 'utf8')).join('\n')
assert.equal(PUBLIC_TAGS.size, COMPONENTS.length, 'every public component must be registered by the showroom')
for (const tag of PUBLIC_TAGS) {
  assert.ok(showroom.includes(`<${tag}`), `${tag} is not demonstrated`)
}
pass('showroom demonstrates every public component')

assert.equal(Object.keys(app.usingComponents || {}).length, 1, 'only the universal page primitive should be global')
for (const page of app.pages) {
  const source = fs.readFileSync(path.join(ROOT, page + '.wxml'), 'utf8')
  const registered = new Set([...Object.keys(app.usingComponents || {}), ...Object.keys(pageConfigs[page].usingComponents || {})])
  for (const match of source.matchAll(/<(bd-[a-z0-9-]+)\b/g)) {
    assert.ok(registered.has(match[1]), `${page}.wxml does not locally register ${match[1]}`)
  }
}
pass('showroom components use page-local registration')

for (const page of app.pages) {
  const source = fs.readFileSync(path.join(ROOT, page + '.wxml'), 'utf8')
  const literalText = source.replace(/{{[\s\S]*?}}/g, '').replace(/<[^>]+>/g, ' ')
  assert.doesNotMatch(literalText, /[A-Za-z]{2,}/, `${page}.wxml contains visible English copy`)
  const copyAttributes = source.matchAll(/\b(?:title|subtitle|text|desc|label|actionText|placeholder)="([^"{][^"]*)"/g)
  for (const match of copyAttributes) {
    assert.doesNotMatch(match[1], /[A-Za-z]{2,}/, `${page}.wxml contains English copy in "${match[1]}"`)
  }
}
pass('showroom visible copy is Chinese')

const photo = require('../utils/photo-uploader')
assert.deepEqual(photo.mergePhotos([1, 2], [3, 4], 3), { photos: [1, 2, 3], overflow: 1 })
assert.equal(photo.remainingSlots(8), 1)
assert.equal(photo.needsCompression(10 * 1024 * 1024 + 1), true)
assert.equal(photo.persistenceToast(2), '2 张照片保存失败，已跳过')

const toast = require('../utils/toast')
const toastContext = { data: {}, setData(patch) { Object.assign(this.data, patch) } }
toast.showToast(toastContext, { message: '已完成', semantic: 'ok', duration: 100 })
assert.equal(toastContext.data.bdToast.visible, true)
assert.equal(toastContext.data.bdToast.semantic, 'ok')
toast.hideToast(toastContext)
assert.equal(toastContext.data['bdToast.visible'], false)

const dock = require('../utils/dock')
const six = Array.from({ length: 6 }, (_, i) => ({ key: `${i}`, label: `${i}`, icon: 'home', url: `/p/${i}` }))
assert.equal(dock.normalizeNavItems(six).length, 5)
assert.equal(dock.routeMatches('/pages/home/home', 'pages/home/home'), true)

const icons = require('../utils/icons')
assert.ok(icons.iconNames().length >= 30)
icons.clearIconCache()
assert.ok(icons.iconDataUri('sparkles').startsWith('data:image/svg+xml;base64,'))
assert.equal(icons.iconCacheSize(), 1)
icons.iconDataUri('sparkles')
assert.equal(icons.iconCacheSize(), 1)
icons.iconDataUri('sparkles', '#041724')
assert.equal(icons.iconCacheSize(), 2)
for (let index = 0; index < 300; index++) icons.iconDataUri('sparkles', `rgb(${index},0,0)`)
assert.equal(icons.iconCacheSize(), 256, 'icon cache remains bounded')

const calendar = require('../utils/calendar')
assert.equal(calendar.parseIsoDate('2026-02-31'), null)
assert.equal(calendar.parseIsoDate('2026-02-28').value, '2026-02-28')
pass('logic helpers and icon registry pass')

const tokens = fs.readFileSync(path.join(ROOT, 'styles', 'tokens.wxss'), 'utf8')
for (const token of ['--ocean-950', '--aqua-400', '--canvas', '--surface', '--ink', '--success', '--danger', '--motion-fast', '--motion-standard', '--motion-overlay', '--ease-aqua', '--ease-aqua-exit']) {
  assert.ok(tokens.includes(`${token}:`), `missing token ${token}`)
}
pass('Polar Ocean token contract is complete')

for (const file of files.filter((item) => item.endsWith('.wxss'))) {
  const source = fs.readFileSync(file, 'utf8')
  assert.doesNotMatch(source, /transition\s*:\s*all\b/, `${path.relative(ROOT, file)} uses transition: all`)
  assert.doesNotMatch(source, /transition\s*:[^;{}]*\b(?:width|height|top|left)\b/, `${path.relative(ROOT, file)} transitions a layout dimension`)
}
pass('motion styles use explicit compositor-friendly transition properties')

function loadComponent(relative, runtime = {}) {
  let definition
  const filename = path.join(ROOT, relative)
  const source = fs.readFileSync(filename, 'utf8')
  const timers = runtime.timers || (runtime.setTimeout ? runtime : null) || {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  }
  vm.runInNewContext(source, {
    Component(value) { definition = value },
    wx: Object.assign({ nextTick(callback) { callback() } }, runtime.wx),
    setTimeout: timers.setTimeout,
    clearTimeout: timers.clearTimeout,
    setInterval: timers.setInterval || setInterval,
    clearInterval: timers.clearInterval || clearInterval,
    Date: runtime.Date || Date,
    require: createRequire(filename),
    console
  }, { filename: relative })
  return definition
}

function fakeTimers() {
  let nextId = 1
  const pending = new Map()
  return {
    setTimeout(callback) {
      const id = nextId++
      pending.set(id, callback)
      return id
    },
    clearTimeout(id) { pending.delete(id) },
    flush() {
      const callbacks = [...pending.values()]
      pending.clear()
      callbacks.forEach((callback) => callback())
    }
  }
}

function instantiateComponent(definition, overrides = {}) {
  const data = { ...(definition.data || {}) }
  for (const [name, property] of Object.entries(definition.properties || {})) data[name] = property.value
  Object.assign(data, overrides)
  const instance = {
    data,
    events: [],
    setData(patch, callback) {
      Object.assign(this.data, patch)
      if (callback) callback()
    },
    triggerEvent(name, detail) { this.events.push({ name, detail }) }
  }
  for (const [name, method] of Object.entries(definition.methods || {})) instance[name] = method.bind(instance)
  return instance
}

for (const name of ['bd-modal', 'bd-popup', 'bd-action-sheet']) {
  const timers = fakeTimers()
  const definition = loadComponent(`components/${name}/${name}.js`, timers)
  const instance = instantiateComponent(definition)
  definition.lifetimes.attached.call(instance)

  instance.data.visible = true
  definition.observers['visible, reducedMotion'].call(instance, true, false)
  assert.equal(instance.data.presented, true, `${name} mounts before entering`)
  assert.equal(instance.data.motionState, 'open', `${name} reaches open state`)

  instance.data.visible = false
  definition.observers['visible, reducedMotion'].call(instance, false, false)
  assert.equal(instance.data.motionState, 'closing', `${name} keeps content mounted while closing`)

  instance.data.visible = true
  definition.observers['visible, reducedMotion'].call(instance, true, false)
  timers.flush()
  assert.equal(instance.data.presented, true, `${name} survives an interrupted close`)
  assert.equal(instance.data.motionState, 'open', `${name} reverses back to open`)

  instance.data.visible = false
  definition.observers['visible, reducedMotion'].call(instance, false, false)
  timers.flush()
  assert.equal(instance.data.presented, false, `${name} unmounts after exit motion`)

  instance.data.reducedMotion = true
  instance.data.visible = true
  definition.observers['visible, reducedMotion'].call(instance, true, true)
  instance.data.visible = false
  definition.observers['visible, reducedMotion'].call(instance, false, true)
  assert.equal(instance.data.presented, false, `${name} dismisses immediately with reduced motion`)
  definition.lifetimes.detached.call(instance)
}
pass('overlay motion handles exit, reversal, repetition, and reduced motion')

function fakeClock() {
  let now = 0
  let nextId = 1
  const intervals = new Map()
  return {
    Date: { now: () => now },
    timers: {
      setTimeout,
      clearTimeout,
      setInterval(callback) {
        const id = nextId++
        intervals.set(id, callback)
        return id
      },
      clearInterval(id) { intervals.delete(id) }
    },
    advance(ms) { now += ms },
    flushIntervals() { [...intervals.values()].forEach((callback) => callback()) },
    intervalCount() { return intervals.size }
  }
}

const countdownClock = fakeClock()
const countdownDefinition = loadComponent('components/bd-countdown/bd-countdown.js', countdownClock)
const countdown = instantiateComponent(countdownDefinition, { seconds: 10, autoplay: true, showHours: true })
countdownDefinition.lifetimes.attached.call(countdown)
assert.equal(countdown.data.remain, 10)
countdownClock.advance(5500)
countdownClock.flushIntervals()
assert.equal(countdown.data.remain, 5, 'countdown derives remaining time from its deadline')
countdown.data.autoplay = false
countdownDefinition.observers['seconds, autoplay, showHours'].call(countdown, 10, false, true)
assert.equal(countdownClock.intervalCount(), 0, 'autoplay=false clears the countdown scheduler')
countdownClock.advance(5000)
countdown.data.autoplay = true
countdownDefinition.observers['seconds, autoplay, showHours'].call(countdown, 10, true, true)
countdownClock.advance(5000)
countdownClock.flushIntervals()
assert.equal(countdown.data.remain, 0)
assert.equal(countdown.events.filter((event) => event.name === 'finish').length, 1)
countdown.data.seconds = 3661
countdown.data.showHours = false
countdownDefinition.observers['seconds, autoplay, showHours'].call(countdown, 3661, true, false)
assert.equal(countdown.data.display.minutes, '61')
countdownDefinition.lifetimes.detached.call(countdown)
pass('countdown handles elapsed time, autoplay changes, and hidden hours')

const pickerDefinition = loadComponent('components/bd-picker/bd-picker.js')
const picker = instantiateComponent(pickerDefinition, {
  options: [{ label: '禁用', value: 1, disabled: true }, { label: '可用', value: 2 }],
  value: 1
})
pickerDefinition.observers['options, value'].call(picker, picker.data.options, picker.data.value)
assert.equal(picker.data.canConfirm, false)
picker.confirm()
assert.equal(picker.events.length, 0, 'picker rejects a disabled initial value')
picker.choose({ currentTarget: { dataset: { index: 1 } } })
picker.confirm()
assert.equal(picker.events.filter((event) => event.name === 'confirm').length, 1)
assert.equal(picker.events.at(-1).detail.value, 2)

const skuDefinition = loadComponent('components/bd-sku-selector/bd-sku-selector.js')
const skuGroups = [
  { key: 'size', options: [{ label: '小', value: 1 }, { label: '大', value: 2, disabled: true }] },
  { key: 'tone', options: [{ label: '冷', value: 'cold' }] }
]
const sku = instantiateComponent(skuDefinition, { groups: skuGroups, selected: { size: 2 }, quantity: 1, min: 1, max: 9 })
skuDefinition.observers['groups, selected, quantity, min, max'].call(sku, skuGroups, sku.data.selected, 1, 1, 9)
assert.equal(sku.data.canConfirm, false)
sku.confirm()
assert.equal(sku.events.length, 0, 'SKU confirmation rejects stale and incomplete selections')
sku.data.selected = { size: 1, tone: 'cold' }
skuDefinition.observers['groups, selected, quantity, min, max'].call(sku, skuGroups, sku.data.selected, 1, 1, 9)
assert.equal(sku.data.canConfirm, true)
sku.quantityChange({ detail: { value: 3 } })
assert.equal(sku.data.draftQuantity, 3)
assert.equal(sku.data.canConfirm, true)
sku.confirm()
assert.equal(sku.events.at(-1).name, 'confirm')
assert.equal(sku.events.at(-1).detail.quantity, 3)
pass('picker and SKU confirmation revalidate current enabled options')

for (const name of ['bd-radio', 'bd-tabs', 'bd-segmented', 'bd-sidebar', 'dock']) {
  const directory = name === 'dock' ? 'dock' : name
  const definition = loadComponent(`components/${directory}/${directory}.js`)
  const property = name === 'bd-radio' ? 'value' : 'active'
  assert.equal(definition.properties[property].type, null, `${name} preserves numeric scalar identifiers`)
}
const numericDock = dock.normalizeNavItems([{ key: 0, label: '零', icon: 'home', url: '/pages/home/home' }])
assert.equal(numericDock[0].key, 0)
pass('selection components preserve string and numeric identifiers')

const imageDefinition = loadComponent('components/bd-image/bd-image.js')
const image = instantiateComponent(imageDefinition, { src: 'a.jpg' })
imageDefinition.observers.src.call(image, 'a.jpg')
image.data.src = 'b.jpg'
imageDefinition.observers.src.call(image, 'b.jpg')
image.failed({ currentTarget: { dataset: { src: 'a.jpg' } }, detail: {} })
assert.equal(image.data.failed, false, 'stale image failures are ignored')
image.loaded({ currentTarget: { dataset: { src: 'b.jpg' } }, detail: {} })
assert.equal(image.data.loading, false)
pass('image state ignores events from replaced sources')

const tabsDefinition = loadComponent('components/bd-tabs/bd-tabs.js')
const tabs = instantiateComponent(tabsDefinition, { items: [{ key: 1, label: '一' }, { key: 2, label: '二' }], active: 1 })
tabs._ready = true
tabs._indicatorGeneration = 1
const tabQueries = []
tabs.createSelectorQuery = () => ({
  select() { return this },
  boundingClientRect() { return this },
  selectAll() { return this },
  exec(callback) { tabQueries.push(callback) }
})
tabs._measureIndicator(1)
tabs.data.active = 2
tabs._indicatorGeneration = 2
tabs._measureIndicator(2)
tabQueries[1]([{ left: 0 }, [{ left: 0, width: 100 }, { left: 100, width: 100 }]])
const latestStyle = tabs.data.indicatorStyle
tabQueries[0]([{ left: 0 }, [{ left: 0, width: 100 }, { left: 100, width: 100 }]])
assert.equal(tabs.data.indicatorStyle, latestStyle, 'stale tab geometry cannot overwrite the latest indicator')
tabs.events.length = 0
tabs.choose({ currentTarget: { dataset: { index: 0 } } })
assert.equal(tabs.data.active, 2, 'controlled tabs do not write their public property')
assert.equal(tabs.events[0].detail.key, 1)
pass('tab measurement is race-safe and controlled')

const progressStyle = fs.readFileSync(path.join(ROOT, 'components/bd-progress/bd-progress.wxss'), 'utf8')
assert.doesNotMatch(progressStyle, /transition\s*:\s*width/)
assert.match(progressStyle, /transform-origin\s*:\s*left/)
const skeletonStyle = fs.readFileSync(path.join(ROOT, 'components/bd-skeleton/bd-skeleton.wxss'), 'utf8')
assert.doesNotMatch(skeletonStyle, /background-position/)
assert.equal((skeletonStyle.match(/animation:\s*bd-skel-flow/g) || []).length, 1)
const backdropDeclarations = files.filter((file) => file.endsWith('.wxss')).reduce((count, file) => {
  const source = fs.readFileSync(file, 'utf8')
  return count + (source.match(/(?<!-webkit-)backdrop-filter\s*:/g) || []).length
}, 0)
assert.equal(backdropDeclarations, 1, 'only the dock may retain backdrop blur')
for (const file of files.filter((item) => item.endsWith('.wxss'))) {
  const source = fs.readFileSync(file, 'utf8')
  if (/animation\s*:[^;{}]*infinite/.test(source)) {
    assert.match(source, /animation-play-state\s*:\s*var\(--motion-play-state/, `${path.relative(ROOT, file)} ignores reduced motion for an infinite animation`)
  }
}
for (const page of app.pages) {
  const source = fs.readFileSync(path.join(ROOT, page + '.wxml'), 'utf8')
  assert.match(source.split('\n')[0], /reducedMotion="{{reducedMotion}}"/, `${page} does not apply reduced motion at its root`)
}
for (const component of ['bd-picker', 'bd-sku-selector']) {
  const source = fs.readFileSync(path.join(ROOT, 'components', component, component + '.wxml'), 'utf8')
  assert.match(source, /<bd-popup[^>]+reducedMotion="{{reducedMotion}}"/, `${component} does not forward reduced motion`)
}
for (const component of ['bd-input', 'bd-search', 'bd-slider']) {
  const source = fs.readFileSync(path.join(ROOT, 'components', component, component + '.js'), 'utf8')
  assert.doesNotMatch(source, /setData\(\{\s*value\b/, `${component} duplicates controlled value updates`)
}
pass('rendering budgets and reduced-motion coverage are enforced')

async function runAsyncChecks() {
  let active = 0
  let peak = 0
  const values = await photo.mapWithConcurrency([1, 2, 3, 4], 2, async (value) => {
    active += 1
    peak = Math.max(peak, active)
    await new Promise((resolve) => setImmediate(resolve))
    active -= 1
    return value * 2
  })
  assert.deepEqual(values, [2, 4, 6, 8])
  assert.equal(peak, 2)
  const uploaderSource = fs.readFileSync(path.join(ROOT, 'components/bd-photo-uploader/bd-photo-uploader.js'), 'utf8')
  assert.doesNotMatch(uploaderSource, /copyFileSync/)
  assert.doesNotMatch(uploaderSource, /saved\.push\(usable\)/)
  assert.match(uploaderSource, /fs\.copyFile\(/)
  pass('photo persistence is asynchronous and concurrency-bounded')
}

runAsyncChecks()
  .then(() => console.log('\nAQUA UI SMOKE OK'))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
