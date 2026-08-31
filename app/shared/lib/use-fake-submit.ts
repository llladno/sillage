import { ref } from 'vue'

const FAKE_SUBMIT_MS = 500

export const useFakeSubmit = () => {
  const pending = ref(false)
  const run = (onDone: () => void) => {
    if (pending.value) return
    pending.value = true
    window.setTimeout(() => {
      pending.value = false
      onDone()
    }, FAKE_SUBMIT_MS)
  }
  return { pending, run }
}
