'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const ROOT = path.resolve(__dirname, '..')
const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'))
const COMPONENTS = Object.values(app.usingComponents).map((componentPath) => path.basename(componentPath))

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
for (const tag of Object.keys(app.usingComponents)) {
  assert.ok(showroom.includes(`<${tag}`), `${tag} is not demonstrated`)
}
pass('showroom demonstrates every public component')

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
assert.ok(icons.iconDataUri('sparkles').startsWith('data:image/svg+xml;base64,'))
pass('logic helpers and icon registry pass')

const tokens = fs.readFileSync(path.join(ROOT, 'styles', 'tokens.wxss'), 'utf8')
for (const token of ['--ocean-950', '--aqua-400', '--canvas', '--surface', '--ink', '--success', '--danger', '--motion-fast', '--motion-standard', '--motion-overlay', '--ease-aqua', '--ease-aqua-exit']) {
  assert.ok(tokens.includes(`${token}:`), `missing token ${token}`)
}
pass('Polar Ocean token contract is complete')

for (const file of files.filter((item) => item.endsWith('.wxss'))) {
  assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /transition\s*:\s*all\b/, `${path.relative(ROOT, file)} uses transition: all`)
}
pass('motion styles use explicit transition properties')

function loadComponent(relative, timers) {
  let definition
  const source = fs.readFileSync(path.join(ROOT, relative), 'utf8')
  vm.runInNewContext(source, {
    Component(value) { definition = value },
    wx: { nextTick(callback) { callback() } },
    setTimeout: timers.setTimeout,
    clearTimeout: timers.clearTimeout,
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
    setData(patch, callback) {
      Object.assign(this.data, patch)
      if (callback) callback()
    },
    triggerEvent() {}
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

console.log('\nAQUA UI SMOKE OK')
