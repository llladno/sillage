// One-off: convert the generated source art in docs/content/ + the extracted
// frame JPGs in /tmp/seq into the web assets under public/.
// Run: node scripts/process-assets.mjs
import { mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC = 'docs/content'
const SEQ_SRC = '/tmp/seq'

mkdirSync('public/sequence', { recursive: true })
mkdirSync('public/object', { recursive: true })
mkdirSync('public/og', { recursive: true })

const webp = (input, output, width, quality = 82) =>
  sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(output)

const jobs = []

// 1 · hero frame sequence
const frames = readdirSync(SEQ_SRC)
  .filter((name) => name.endsWith('.jpg'))
  .sort()
frames.forEach((name, index) => {
  const seq = String(index + 1).padStart(4, '0')
  jobs.push(webp(join(SEQ_SRC, name), `public/sequence/frame-${seq}.webp`, 1600, 78))
})
console.log(`sequence: ${frames.length} frames`)

// 2 · poster = first hero frame
jobs.push(webp(`${SRC}/FIRST_frame.jpg`, 'public/hero-poster.webp', 1920, 82))

// 3 · object section image
jobs.push(webp(`${SRC}/object.jpg`, 'public/object.webp', 1200, 84))

// 4 · OG card (keep .png name the head refers to)
jobs.push(
  sharp(`${SRC}/default.jpg`)
    .resize({ width: 1200, height: 630, fit: 'cover' })
    .png()
    .toFile('public/og/default.png'),
)

// 5 · favicon set
jobs.push(
  sharp(`${SRC}/favicon.jpg`).resize(512, 512).png().toFile('public/favicon-512.png'),
)
jobs.push(
  sharp(`${SRC}/favicon.jpg`)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png'),
)
jobs.push(sharp(`${SRC}/favicon.jpg`).resize(32, 32).png().toFile('public/favicon.png'))

// 6 · object craft macros
for (const key of ['glass', 'cap', 'fill', 'batch']) {
  jobs.push(webp(`${SRC}/${key}.jpg`, `public/object/${key}.webp`, 1200, 84))
}

// 7 · acquire product shot
jobs.push(webp(`${SRC}/acquire.jpg`, 'public/acquire.webp', 1200, 86))

// 8 · story atmosphere
jobs.push(webp(`${SRC}/story.jpg`, 'public/story.webp', 2000, 80))

// 9 · background grain texture
jobs.push(webp(`${SRC}/paper-texture.jpg`, 'public/paper-texture.webp', 1400, 60))

await Promise.all(jobs)
console.log(`assets processed: ${jobs.length} files written to public/`)
