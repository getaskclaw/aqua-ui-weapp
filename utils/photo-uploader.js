// bd-photo-uploader 计数/上限纯逻辑(WO-011):从 pages/report 上传内核
// 抽出的可测部分——九宫格上限、计数提示、合并裁剪、超限提示文案。
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

// 计数提示:「3/9」形态,虚线框与页内提示统一引用。
function countText(count, max = MAX_PHOTOS) {
  return `${count}/${max}`
}

// 合并新选照片:裁剪到上限,报告溢出数(chooseMedia count 已限位,
// 此处兜底并发/异常路径,绝不静默突破上限)。
function mergePhotos(existing, added, max = MAX_PHOTOS) {
  const merged = existing.concat(added)
  if (merged.length <= max) return { photos: merged, overflow: 0 }
  return { photos: merged.slice(0, max), overflow: merged.length - max }
}

function removeAt(photos, index) {
  return photos.filter((_, i) => i !== index)
}

// 超过应用上限需先走 wx.compressImage 再复检(同 report 页既有策略)。
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
