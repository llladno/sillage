import { ref } from 'vue'

const PAD_WIDTH = 4

export const frameUrl = (prefix: string, index: number, ext: string): string =>
  `${prefix}${String(index).padStart(PAD_WIDTH, '0')}.${ext}`

type ScrubFramesOptions = {
  prefix: string
  count: number
  ext: string
  enabled: boolean
}

export const useScrubFrames = (options: ScrubFramesOptions) => {
  // Populated synchronously with Image objects; each frame becomes paintable as
  // its own `load` fires. The canvas paints the nearest ready frame meanwhile,
  // so there is never a blank / placeholder flash once frame 1 is in.
  const images = ref<HTMLImageElement[]>([])
  const settled = ref(0)

  if (options.enabled && import.meta.client) {
    const bucket: HTMLImageElement[] = []
    for (let index = 1; index <= options.count; index += 1) {
      const image = new Image()
      const onSettle = () => {
        settled.value += 1
      }
      image.addEventListener('load', onSettle, { once: true })
      image.addEventListener('error', onSettle, { once: true })
      image.src = frameUrl(options.prefix, index, options.ext)
      bucket.push(image)
    }
    images.value = bucket
  }

  return { images, settled }
}
