<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { FRAME_COUNT } from '~/widgets/scrub-hero/model/constants'
import {
  frameIndexFor,
  paintFrame,
  paintPlaceholder,
} from '~/widgets/scrub-hero/ui/ScrubCanvas/paint'

const props = defineProps<{ progress: number; images: HTMLImageElement[] }>()

const canvas = ref<HTMLCanvasElement | null>(null)
const currentFrame = ref(0)

const render = () => {
  const element = canvas.value
  if (!element) return
  const context = element.getContext('2d')
  if (!context) return

  const { clientWidth, clientHeight } = element
  const ratio = window.devicePixelRatio || 1
  if (element.width !== Math.round(clientWidth * ratio)) {
    element.width = Math.round(clientWidth * ratio)
    element.height = Math.round(clientHeight * ratio)
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)

  const frame = frameIndexFor(props.progress, FRAME_COUNT)
  currentFrame.value = frame
  const image = props.images[frame]
  if (image && image.complete && image.naturalWidth > 0) {
    paintFrame(context, image, clientWidth, clientHeight)
  } else {
    paintPlaceholder(context, props.progress, clientWidth, clientHeight)
  }
}

watch(
  () => props.progress,
  () => requestAnimationFrame(render),
)
onMounted(render)
</script>

<template>
  <canvas
    ref="canvas"
    :data-frame="currentFrame"
    class="h-full w-full"
    aria-hidden="true"
  />
</template>
