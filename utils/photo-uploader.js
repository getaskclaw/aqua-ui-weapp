// bd-photo-uploader pure, testable limits and collection helpers.
// Covers the 3x3 maximum, count labels, bounded merge, and overflow feedback.
// 纯 JS 无 wx 依赖,node 可测;components/bd-photo-uploader 负责
// wx.chooseMedia/压缩/持久化胶水。上限常量与服务端一致(9 张 / 10 MiB)。
'use strict'

const MAX_PHOTOS = 9
const MAX_PHOTO_BYTES = 10 * 1024 * 1024

function remainingSlots(count, max = MAX_PHOTOS) {
  return Math.max(0, max - count)
}

function canAdd(count, max = MAX_PHOTOS) {
  return remainingSlots(count, max) > 0
}

// Counter label in the compact “3/9” form.
function countText(count, max = MAX_PHOTOS) {
  return `${count}/${max}`
}

// Merge new photos, clamp to the maximum, and report overflow.
function mergePhotos(existing, added, max = MAX_PHOTOS) {
  const merged = existing.concat(added)
  if (merged.length <= max) return { photos: merged, overflow: 0 }
  return { photos: merged.slice(0, max), overflow: merged.length - max }
}

function removeAt(photos, index) {
  return photos.filter((_, i) => i !== index)
}

// Files above the application limit must be compressed and checked again.
function needsCompression(size, maxBytes = MAX_PHOTO_BYTES) {
  return size > maxBytes
}

function oversizeToast(count) {
  return `${count} 张照片压缩后仍超过 10 MB，已跳过`
}

module.exports = {
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  remainingSlots,
  canAdd,
  countText,
  mergePhotos,
  removeAt,
  needsCompression,
  oversizeToast
}
