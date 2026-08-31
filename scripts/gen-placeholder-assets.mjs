// Writes small solid placeholder art so builds pass before real assets exist.
// Swap these files for the real renders — see public/sequence/README.md.
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const GROUND = { r: 10, g: 9, b: 8 }
const POSTER = { width: 1600, height: 900 }
const OBJECT = { width: 800, height: 1000 }
const OG_IMAGE = { width: 1200, height: 630 }

mkdirSync('public/og', { recursive: true })
mkdirSync('public/sequence', { recursive: true })

const solid = (path, { width, height }) =>
  sharp({
    create: { width, height, channels: 3, background: GROUND },
  }).toFile(path)

await Promise.all([
  solid('public/hero-poster.webp', POSTER),
  solid('public/object.webp', OBJECT),
  solid('public/og/default.png', OG_IMAGE),
])

console.log('placeholder assets written')
