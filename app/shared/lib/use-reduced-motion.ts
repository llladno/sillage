import { onBeforeUnmount, ref } from 'vue'

export const useReducedMotion = () => {
  const reduced = ref(false)
  if (import.meta.client) {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches
    const onChange = (event: MediaQueryListEvent) => {
      reduced.value = event.matches
    }
    query.addEventListener('change', onChange)
    onBeforeUnmount(() => query.removeEventListener('change', onChange))
  }
  return reduced
}
