import { loadGsap } from '~/shared/lib'

// Momentum smooth-scroll. Lenis' rAF loop is driven by GSAP's ticker so the
// scrub hero and every ScrollTrigger stay locked to the smoothed position.
// Skipped under prefers-reduced-motion — the page keeps native scrolling.
const MS_PER_SECOND = 1000

export default defineNuxtPlugin(async () => {
  // Every load starts at the top so the intro replays and hydration can't
  // strand the scroll — this is not an animation, so it runs regardless of
  // reduced motion. Skipped when the URL points at a section (#anchor) so
  // shared deep links still land where they point.
  const hasHashTarget = window.location.hash.length > 1
  if (!hasHashTarget && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const [{ default: Lenis }, gsapContext] = await Promise.all([
    import('lenis'),
    loadGsap(),
  ])
  if (!gsapContext) return

  const { gsap, ScrollTrigger } = gsapContext
  const lenis = new Lenis({ anchors: true })
  if (!hasHashTarget) lenis.scrollTo(0, { immediate: true })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * MS_PER_SECOND))
  gsap.ticker.lagSmoothing(0)
})
