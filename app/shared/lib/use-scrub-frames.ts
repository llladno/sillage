import { ref } from 'vue'

const PAD_WIDTH = 4
const LOAD_READY_RATIO = 0.85

export const frameUrl = (prefix: string, index: number, ext: string): string =>
  `${prefix}${String(index).padStart(PAD_WIDTH, '0')}.${ext}`

type ScrubFramesOptions = {
  prefix: string
  count: number
  ext: string
  enabled: boolean
}

export const useScrubFrames = (options: ScrubFramesOptions) => {
  const images = ref<HTMLImageElement[]>([])
  const loaded = ref(false)

  if (options.enabled && import.meta.client) {
    let settled = 0
    const readyThreshold = Math.ceil(options.count * LOAD_READY_RATIO)
    const bucket: HTMLImageElement[] = []
    for (let index = 1; index <= options.count; index += 1) {
      const image = new Image()
      const onSettle = () => {
        settled += 1
        if (settled >= readyThreshold && !loaded.value) {
          images.value = bucket
          loaded.value = true
        }
      }
      image.addEventListener('load', onSettle, { once: true })
      image.addEventListener('error', onSettle, { once: true })
      image.src = frameUrl(options.prefix, index, options.ext)
      bucket.push(image)
    }
  }

  return { images, loaded }
}
