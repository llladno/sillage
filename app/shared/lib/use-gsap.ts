// Loads GSAP + ScrollTrigger on the client, or returns null when animation
// should be skipped (SSR, or the visitor prefers reduced motion).
export const loadGsap = async () => {
  if (import.meta.server) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger }
}
