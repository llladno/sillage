<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { FRAME_COUNT } from '~/widgets/scrub-hero/model/constants'
import {
  frameIndexFor,
  paintFrame,
  paintPlaceholder,
} from '~/widgets/scrub-hero/ui/ScrubCanvas/paint'

const props = defineProps<{
  progress: number
  images: HTMLImageElement[]
  settled?: number
}>()

const MAX_FRAME_SEARCH = 12

const canvas = ref<HTMLCanvasElement | null>(null)
const currentFrame = ref(0)

const isReady = (image: HTMLImageElement | undefined): image is HTMLImageElement =>
  Boolean(image && image.complete && image.naturalWidth > 0)

// First-paint image: shown until any real frame has decoded.
const poster = import.meta.client ? new Image() : undefined
if (poster) poster.src = '/hero-poster.webp'

// Prefer the exact frame; otherwise the nearest already-decoded neighbour, so
// there is no placeholder flash while the sequence streams in.
const bestFrameFor = (target: number): HTMLImageElement | undefined => {
  if (isReady(props.images[target])) return props.images[target]
  for (let step = 1; step <= MAX_FRAME_SEARCH; step += 1) {
    if (isReady(props.images[target - step])) return props.images[target - step]
    if (isReady(props.images[target + step])) return props.images[target + step]
  }
  return undefined
}

const render = () => {
  const element = canvas.value
  if (!element) return
  const context = element.getContext('2d')
  if (!context) return

  const { clientWidth, clientHeight } = element
  if (clientWidth === 0 || clientHeight === 0) return
  const ratio = window.devicePixelRatio || 1
  if (element.width !== Math.round(clientWidth * ratio)) {
    element.width = Math.round(clientWidth * ratio)
    element.height = Math.round(clientHeight * ratio)
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)

  const frame = frameIndexFor(props.progress, FRAME_COUNT)
  currentFrame.value = frame
  const image = bestFrameFor(frame) ?? (isReady(poster) ? poster : undefined)
  if (image) {
    paintFrame(context, image, clientWidth, clientHeight)
  } else {
    paintPlaceholder(context, props.progress, clientWidth, clientHeight)
  }
}

const scheduleRender = () => requestAnimationFrame(render)

let observer: ResizeObserver | undefined

watch(() => props.progress, scheduleRender)
watch(() => props.settled, scheduleRender)

onMounted(() => {
  scheduleRender()
  if (poster) poster.addEventListener('load', scheduleRender, { once: true })
  if (canvas.value && 'ResizeObserver' in window) {
    observer = new ResizeObserver(scheduleRender)
    observer.observe(canvas.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <canvas
    ref="canvas"
    :data-frame="currentFrame"
    class="h-full w-full"
    aria-hidden="true"
  />
</template>
