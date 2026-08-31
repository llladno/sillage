# SILLAGE — image generation prompts

Every raster asset the site uses, with production-grade prompts. Target look:
**niche-fragrance editorial — premium, expensive, restrained, hyperreal.**
References to lean on: Frédéric Malle / Le Labo / Byredo / Nishane campaign
imagery; still-life lighting of Peter Lippmann and Carl Kleiner; Aesop product
photography.

House palette (bake into every prompt): background near-black `#0A0908`,
highlights warm cream `#F2EBE3`, a single accent of burnt amber `#C8641E` living
inside the liquid / the glow. Low key, rich blacks, never crushed, fine natural
film grain, no HDR clarity look.

---

## The flacon — locked description (paste verbatim into every prompt)

> a heavy rectangular flacon of thick optical crystal, proportion roughly
> 1 : 1.6, softly chamfered vertical edges, a deep bevelled base that behaves
> like a lens and bends the light passing through it; filled with a translucent
> liquid the colour of strong black tea shot through with amber — almost ink;
> a slim matte-black anodised-aluminium cap with a fine knurled band; a single
> line of small debossed serif capitals reading "SILLAGE" pressed into the front
> glass, no other branding, no label, no box

## The lighting — locked description

> one large gridded softbox as key from upper-left at 45°, a narrow vertical
> strip light skimming the right edge of the glass as a rim, a small warm amber
> bounce card from below lighting the liquid from within, everything else falls
> to pure black `#0A0908`; deep controlled specular highlights, one soft caustic
> pooled on an invisible floor, no visible set, no horizon

## The camera — locked description

> shot on a medium-format digital back, 120 mm macro lens at f/8, focus-stacked
> tack-sharp across the whole flacon with a gentle fall-off into black, zero lens
> distortion, natural perspective

---

## 1 · Hero scroll sequence — FIRST frame

File: feeds `public/sequence/frame-0001.webp` **and** `public/hero-poster.webp`.
Aspect **16:9**, render at **3840 × 2160** (also keep a 2.39:1 crop and a
vertical-safe centre for mobile).

```
Cinematic still-life product photograph, ultra photorealistic, 8K, pure black
seamless background (#0A0908). Centered, floating slightly above the invisible
floor: a heavy rectangular flacon of thick optical crystal, proportion roughly
1:1.6, softly chamfered vertical edges, a deep bevelled base that behaves like a
lens and bends the light passing through it; filled with a translucent liquid
the colour of strong black tea shot through with amber, almost ink; a slim
matte-black anodised-aluminium cap seated on top with a fine knurled band; a
single line of small debossed serif capitals reading "SILLAGE" pressed into the
front glass, no other branding, no label, no box.

Lighting: one large gridded softbox as key from the upper-left at 45 degrees, a
narrow vertical strip light skimming the right edge of the glass as a cold rim,
a small warm amber bounce card from below lighting the liquid from within so a
low ember-orange glow (#C8641E) sits in the heart of the bottle; everything
else falls to pure black; deep controlled speculars, one soft caustic pooled on
the invisible floor, faint reflection of the softbox on the front face.

Camera: medium-format digital back, 120mm macro lens at f/8, focus-stacked,
tack-sharp across the whole flacon with a gentle fall-off into black, zero
distortion, eye-level, flacon dead centre with generous negative space on all
sides.

Grade and finish: near-black ground, warm cream highlights (#F2EBE3), a single
accent of burnt amber inside the liquid; low overall key, rich un-crushed
blacks, fine natural 35mm film grain, subtle anamorphic bokeh, no HDR clarity,
no over-sharpening. Editorial niche-fragrance advertising, restrained,
expensive, quiet. In the spirit of Frédéric Malle and Le Labo campaign imagery,
still-life lighting of Peter Lippmann.

Aspect ratio 16:9.
```

**Negative:** `text other than the debossed SILLAGE, watermark, logo, brand
name, box, packaging, dropper, spray trigger visible, hands, people, reflection
of a photographer, studio visible, floor seam, horizon line, colour cast on the
background, blue tint, plastic look, cheap CGI, blown highlights, crushed
blacks, HDR, oversharpened, busy composition, props, flowers, fabric`

---

## 2 · Hero scroll sequence — LAST frame

File: feeds the final frames of `public/sequence/` (`frame-0120.webp` area).
Same flacon, same lighting, same camera. Changes: the flacon has rotated ~90°,
the cap floats just above the nozzle, and a fine mist has been released and
drifts off as the _sillage_ — the whole point of the brand.

```
Cinematic still-life product photograph, ultra photorealistic, 8K, pure black
seamless background (#0A0908). The same heavy rectangular flacon of thick
optical crystal (proportion 1:1.6, chamfered edges, deep lens-like bevelled
base, ink-amber liquid inside, debossed serif "SILLAGE" on the front glass), now
rotated roughly 90 degrees so the corner faces camera and the light rakes across
two faces at once. The slim matte-black knurled cap has lifted and floats,
suspended, a few centimetres above the concealed atomiser. From the nozzle a
fine cold mist has just been released: it unfurls into a slow translucent ribbon
that drifts to the right across the frame, catching the rim light as a pale
amber veil, a scattering of discrete micro-droplets held sharp and suspended
within it, the far end of the trail dissolving softly into the black — this is
the scent's wake.

Lighting: large gridded softbox key from upper-left at 45 degrees, cold vertical
strip rim on the right edge of the glass, warm amber bounce from below; the
inner ember glow (#C8641E) now brighter and larger, pushing warm light through
the liquid and up into the base of the mist; everything else pure black; deep
speculars on the two lit faces, one soft caustic on the invisible floor.

Camera: medium-format digital back, 120mm macro at f/8, focus-stacked on the
flacon with the mist falling gently out of focus as it recedes, zero distortion,
eye-level, flacon left-of-centre so the mist has room to travel right.

Grade and finish: near-black ground, warm cream highlights (#F2EBE3), burnt
amber accent in the liquid and the lit edge of the mist; low key, rich blacks,
fine 35mm grain, delicate anamorphic flare on the brightest specular, no HDR, no
oversharpening. Editorial, restrained, expensive — niche-fragrance advertising
in the spirit of Frédéric Malle, Le Labo, Nishane.

Aspect ratio 16:9.
```

**Negative:** same as frame 1, plus `thick smoke, steam, fog machine haze,
dense cloud, cartoon vapour, spray can, aerosol, motion-blur smear, double
exposure of the bottle, extra bottles`

---

## 3 · Hero sequence — interpolation / video prompt

Generate the frames as a short clip (first + last frame conditioning), then
decompose to a WebP/AVIF image sequence for the scrub. Recommended engines:
**Kling 2.x**, **Runway Gen-4**, **Veo 3**, **Sora** — all support start+end
frame. Keep it 4–6 s, then Topaz-upscale to 4K and export ~120 frames.

```
Slow cinematic turntable in a pure black void. A heavy rectangular crystal
perfume flacon rotates smoothly and continuously about 90 degrees; warm amber
light refracts through the ink-coloured liquid as it turns, the inner glow
gradually intensifying. Part-way through, the matte-black cap lifts weightlessly
and floats above the nozzle; a fine cold mist then sprays from the atomiser and
blooms into a soft translucent ribbon that drifts sideways across frame as a
scent trail, catching a pale amber rim light, then dissolving into the black.
Camera locked, no cuts, hypnotic and unhurried, gallery-quiet. Studio product
lighting: gridded softbox key upper-left, cold strip rim right, warm bounce
below. 24fps, shallow depth of field, fine film grain, editorial fragrance
advertising mood.
```

**Negative:** `camera shake, fast motion, whip pan, cuts, morphing artefacts,
warping glass, wobbling text, duplicated bottle, dense smoke, fog, people,
hands, background detail, colour banding, flicker`

---

## 4 · `public/object.webp` — the Object section

Shown in the fallback / mobile stack and as the craft image. A closer, more
tactile study of the flacon on black — the _object_ as a made thing. Aspect
**4:5**, render at **2048 × 2560**.

```
Cinematic still-life macro photograph, ultra photorealistic, 8K, pure black
background (#0A0908). Three-quarter close study of a heavy rectangular flacon of
thick optical crystal: proportion 1:1.6, softly chamfered vertical edges, a deep
bevelled base that refracts a small pool of amber light onto the invisible
floor, filled with a translucent ink-amber liquid; a slim matte-black
anodised-aluminium cap with a fine knurled band resting beside the flacon on the
same black surface; a single line of small debossed serif capitals reading
"SILLAGE" catching a sliver of light on the front glass. The composition favours
material and weight — thick glass walls, the meniscus of the liquid, the matte
grain of the cap against the wet-looking gloss of the crystal.

Lighting: single large gridded softbox from the upper-left as key, a fine cold
strip rim down the right edge, a low warm amber bounce lighting the liquid from
within; deep speculars, controlled reflections, one soft caustic on the floor,
everything else falls to pure black.

Camera: medium-format digital back, 120mm macro at f/5.6, focus on the front
glass and the debossed type, the far edge of the flacon melting gently into the
dark, zero distortion.

Grade: near-black ground, warm cream highlights (#F2EBE3), burnt amber (#C8641E)
in the liquid; low key, rich blacks, fine film grain, no HDR, no oversharpen.
Restrained, expensive, editorial — object photography in the spirit of Aesop and
Le Labo.

Aspect ratio 4:5.
```

**Negative:** `label, sticker, box, packaging, dropper, spray trigger, hands,
people, studio visible, floor seam, horizon, blue cast, plastic, cheap CGI,
blown highlights, crushed blacks, HDR, oversharpened, clutter, flowers, fabric,
water splash`

---

## 5 · `public/og/default.png` — social share card

Open Graph / link preview. Must read at thumbnail size and hold the wordmark.
Aspect **1.91 : 1**, render at **2400 × 1260**, export/downscale to
**1200 × 630**. Keep a ~10% safe margin — corners get cropped by some clients.

```
Cinematic still-life product photograph, ultra photorealistic, pure black
background (#0A0908), wide 1.91:1 composition. The heavy rectangular crystal
flacon (proportion 1:1.6, chamfered edges, deep lens-like base, ink-amber
liquid, slim matte-black knurled cap, small debossed serif "SILLAGE" on the
glass) stands just right of centre, lit by a gridded softbox from the
upper-left with a cold strip rim on the right and a warm amber inner glow
(#C8641E) in the liquid. A faint translucent wisp of mist trails to the right
and dissolves into the black. Generous empty black space on the left third for a
wordmark overlay. Deep speculars, one soft caustic on the invisible floor, rich
un-crushed blacks, warm cream highlights (#F2EBE3), fine film grain, no HDR.
Restrained, expensive, editorial niche-fragrance advertising.

Aspect ratio 1.91:1.
```

**Negative:** `existing text or logo baked in, watermark, box, label, people,
hands, busy background, bright background, colour cast, HDR, oversharpened,
cheap CGI`

> The wordmark **SILLAGE** (Fraunces / a high-contrast serif, letter-spaced,
> `#F2EBE3`) is composited on the left third afterwards in code/design — do not
> ask the model to render display text beyond the tiny debossed mark on the
> glass.

---

## Consistency & technical notes

- **Lock the flacon.** Generate frame 1 first, pick the hero, then produce every
  other asset as **image-to-image / reference-image from that render**
  (denoise ≈ 0.45–0.60), keeping the "locked description" sentence identical
  word-for-word. Reuse the seed wherever the tool allows.
- **Stills model:** Midjourney v7, Flux 1.1 Pro, or Google Imagen — whichever
  gives the cleanest glass and blackest black. Upscale with Magnific or Topaz
  Gigapixel to the target resolution.
- **The mist** is the one fragile element for both stills and video — keep it
  _thin, cold, translucent_, never a smoke cloud. If a generation makes it
  dense, regenerate or end the sequence on a faint wisp.
- **Export for the scrub:** 120 frames, WebP or AVIF, ~1600 px wide, whole set
  under ~4 MB. Drop into `public/sequence/` as `frame-0001.webp …
frame-0120.webp`, replace `public/hero-poster.webp` with frame 1, then set
  `USE_PLACEHOLDER = false` in
  `app/widgets/scrub-hero/model/constants.ts`. See `public/sequence/README.md`.
- **Colour management:** export sRGB, no ICC surprises; the site background is
  `#0A0908`, so the render's black must match or the frame will "float".
- **Grain:** add it at the end, lightly, uniformly — it hides WebP banding on
  the large black areas.

---

# Optional — richer imagery

The build ships with only assets 1–5. Everything below is opt-in: it makes the
site more photographic at the cost of small code changes (noted per item). The
same house style / flacon lock / lighting lock / camera lock apply.

## 6 · `public/favicon` — the monogram

Replace the default Nuxt favicon. Best made as **vector** from the wordmark, but
if generating a raster source: render at **512 × 512**, export
`favicon.ico` (16/32/48) + `favicon.svg` + `apple-touch-icon.png` (180×180).

```
A minimal fragrance-house monogram on a near-black square (#0A0908). A single
high-contrast serif capital "S" in warm cream (#F2EBE3), Didone / Fraunces
character, generous weight contrast, optically centred, small tail of the S
extending into a fine tapering wisp that curls to the right — a scent trail.
Flat, no gradient, no bevel, no 3D, crisp edges, reads at 16 pixels. Luxury
editorial mark, restrained.
```

**Negative:** `photo, realism, gradient, drop shadow, 3D, bevel, emboss,
multiple letters, full word, clutter, thin hairlines that vanish when small,
bright colours`

Code: drop the files in `public/`, add the `<link rel="icon">` set to
`nuxt.config.ts` `app.head.link`.

## 7 · Object slider — four panel macros

Turns the desktop `<CraftPanel>` (currently a CSS silhouette) into four macro
studies, one per panel. Aspect **3:4**, render **1800 × 2400** each, export
WebP ~1200 px wide. Same black ground, same grade.

Code: add `imageKey?: string` to `CraftPanel` props and an `<NuxtImg>` per panel
in `ObjectSection.vue`; files `public/object/glass.webp` … `batch.webp`.

**7a — glass**

```
Extreme macro, ultra photorealistic, 8K, pure black background (#0A0908). The
chamfered vertical edge of a thick block of optical crystal filling the frame
diagonally; you can see straight into the glass — internal reflections, a bright
caustic streak, the ink-amber liquid pooled behind the near wall, its meniscus
catching a cream highlight. Gridded softbox key from upper-left, cold strip rim
on the edge, warm bounce from below. Razor-sharp on the front edge, deep
fall-off into black. Rich un-crushed blacks, warm cream highlights (#F2EBE3),
burnt amber (#C8641E) in the liquid, fine film grain, no HDR. Aspect ratio 3:4.
```

**7b — cap**

```
Extreme macro, ultra photorealistic, 8K, pure black background (#0A0908). A slim
matte-black anodised-aluminium perfume cap seen three-quarter from above, its
fine knurled band raking the light into a row of tiny cream specular dashes; the
matte top face almost swallowing the light, one soft reflection of the softbox.
The cap rests on the same black surface with a faint contact shadow. Gridded
softbox key upper-left, cold rim right. Tack-sharp on the knurling, background
pure black. Low key, rich blacks, warm cream highlights, minimal, expensive.
Aspect ratio 3:4.
```

**7c — fill**

```
Extreme macro, ultra photorealistic, 8K, pure black background (#0A0908).
Looking through the front wall of the crystal flacon at the liquid inside: a
translucent ink-amber fluid, the surface meniscus curving up the glass, a slow
swirl suspended in it like diluted ink, backlit by a warm amber bounce so the
liquid glows from within (#C8641E) while the glass edges stay cool. A few
minuscule bubbles clinging to the inner wall. Shallow depth of field, the swirl
sharp, the far side melting into black. Fine film grain, no HDR, editorial.
Aspect ratio 3:4.
```

**7d — batch**

```
Extreme macro, ultra photorealistic, 8K, pure black background (#0A0908). The
frosted underside of the flacon's thick bevelled base, raked by a low grazing
light so a line of debossed serif type — "SILLAGE 01" above a small batch number
like "N° 0042" — casts fine shadows and reads by relief alone, no ink. The
frosted glass scatters the light into a soft cream glow at the edges, the centre
falling to near-black. Tactile, precise, hand-finished. Grazing key light from
the left, everything else black. Aspect ratio 3:4.
```

**Negative (all four):** `full bottle in frame, label, sticker, box, hands,
people, studio visible, horizon, blue cast, plastic, cheap CGI, blown
highlights, crushed blacks, HDR, oversharpened, printed ink text, colour print`

## 8 · `public/acquire.webp` — product shot for the buy block

A clean hero of the flacon beside the Acquire controls. More "catalogue" than
the hero frames but still black-ground editorial. Aspect **4:5**, render
**2048 × 2560**.

Code: add an `<NuxtImg>` column to `AcquireSection.vue` (grid: image | controls).

```
Cinematic product photograph, ultra photorealistic, 8K, pure black background
(#0A0908). The heavy rectangular crystal flacon standing upright, dead centre,
cap on, filled with ink-amber liquid, small debossed serif "SILLAGE" on the
front glass; the slim matte-black knurled cap catching one clean cream
highlight. Gridded softbox key from the upper-left, cold vertical strip rim down
the right edge of the glass, warm amber bounce lighting the liquid from within
(#C8641E); one soft caustic pooled on the invisible floor, a faint mirror
reflection of the flacon on the black surface below it. Medium-format, 120mm
macro at f/8, focus-stacked, tack-sharp, zero distortion, generous black space
above and below. Rich un-crushed blacks, warm cream highlights (#F2EBE3), fine
35mm grain, no HDR, restrained and expensive. Aspect ratio 4:5.
```

**Negative:** `label, box, packaging, dropper, spray trigger, hands, people,
props, flowers, fabric, bright background, colour cast, HDR, oversharpened,
cheap CGI, floating text, watermark`

## 9 · `public/story.webp` — atmosphere for the Story section (optional)

Only add if the section feels too bare — it competes with the typography, so
keep it dark and abstract. Aspect **16:9** or **3:2**, render **3000 px** wide.

Code: absolutely-positioned `<NuxtImg>` behind `[data-body]` at ~25% opacity in
`StorySection.vue`, or a right-hand column.

```
Cinematic still-life, ultra photorealistic, 8K, near-black background (#0A0908).
A single sheet of heavy cream cotton paper (#F2EBE3), unfolded, one soft crease,
lying on a black surface; a fine fountain-pen nib resting on it, and a single
bloom of black ink soaking into the fibres at one corner, its edge feathering.
A shaft of warm low light (#C8641E tint) rakes across from the left, most of the
frame in shadow, deep negative space. Shallow depth of field, the nib sharp, the
ink bloom sharp, the rest falling to black. Fine grain, no HDR, melancholic,
editorial, quiet — "the smell of a letter you never sent". Aspect ratio 16:9.
```

**Negative:** `handwriting, legible words, full letter of text, envelope with
address, hands, people, bright scene, warm wood table, rustic props, HDR,
oversharpened, cheap CGI, colour cast`

## 10 · Background grain / paper texture (optional)

A seamless overlay to sit under every section at very low opacity — kills WebP
banding on the big black fields and adds a printed-matter feel. Render a
**2048 × 2048 seamless tile**, export a small PNG.

```
A seamless tileable texture: extremely fine warm-grey photographic grain and
faint uncoated-paper fibre over a near-black field (#0A0908), very low contrast,
no visible features, no pattern, no vignette, evenly lit, edges tiling
perfectly. Looks like 35mm film grain plus mezzotint. Subtle.
```

**Negative:** `visible pattern, repeating motif, vignette, gradient, large
blotches, colour, high contrast, watermark, seams`

Code: `body::before { background-image: url(...); opacity: .04; mix-blend-mode:
overlay; position: fixed; inset: 0; pointer-events: none; }` in `main.css`.

## Priority if you only do a few

1. **favicon** (#6) — it's currently the stock Nuxt icon, that's the one real gap.
2. **Object panel macros** (#7) — biggest visual upgrade, makes the signature
   slider feel like a campaign.
3. **acquire.webp** (#8) — expected for a premium fragrance buy block.
4. #9 and #10 are polish; skip unless the page feels thin.
