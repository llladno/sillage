import { clamp } from '~/shared/lib'

const CORE_MIN_RADIUS = 0.09
const CORE_MAX_RADIUS = 0.34
const BOTTLE_WIDTH_RATIO = 0.16
const BOTTLE_HEIGHT_RATIO = 0.42
const BOTTLE_CORNER = 12
const ROTATION_TURNS = 1.4

export const frameIndexFor = (progress: number, count: number): number =>
  Math.round(clamp(progress, 0, 1) * (count - 1))

type FrameFit = 'cover' | 'contain'

export const paintFrame = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  fit: FrameFit = 'cover',
): void => {
  const ratio = width / image.width
  const heightRatio = height / image.height
  const scale =
    fit === 'contain' ? Math.min(ratio, heightRatio) : Math.max(ratio, heightRatio)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  context.clearRect(0, 0, width, height)
  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  )
}

export const paintPlaceholder = (
  context: CanvasRenderingContext2D,
  progress: number,
  width: number,
  height: number,
): void => {
  const eased = clamp(progress, 0, 1)
  context.fillStyle = '#0a0908'
  context.fillRect(0, 0, width, height)

  const centerX = width / 2
  const centerY = height / 2
  const coreRadius =
    (CORE_MIN_RADIUS + (CORE_MAX_RADIUS - CORE_MIN_RADIUS) * eased) *
    Math.min(width, height)

  context.save()
  context.translate(centerX, centerY)
  context.rotate(eased * Math.PI * ROTATION_TURNS)
  const bottleWidth = width * BOTTLE_WIDTH_RATIO
  const bottleHeight = height * BOTTLE_HEIGHT_RATIO
  context.fillStyle = 'rgba(242,235,227,0.08)'
  context.strokeStyle = 'rgba(242,235,227,0.35)'
  context.lineWidth = 2
  context.beginPath()
  context.roundRect(
    -bottleWidth / 2,
    -bottleHeight / 2,
    bottleWidth,
    bottleHeight,
    BOTTLE_CORNER,
  )
  context.fill()
  context.stroke()
  context.restore()

  const glow = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    coreRadius,
  )
  glow.addColorStop(0, 'rgba(200,100,30,0.9)')
  glow.addColorStop(1, 'rgba(200,100,30,0)')
  context.fillStyle = glow
  context.beginPath()
  context.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
  context.fill()
}
