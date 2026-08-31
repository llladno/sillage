const TOAST_MS = 3200
let nextId = 0

export const useToasts = () => {
  const toasts = useState<{ id: number; text: string }[]>('toasts', () => [])
  const push = (text: string) => {
    nextId += 1
    const id = nextId
    toasts.value = [...toasts.value, { id, text }]
    if (import.meta.client) {
      window.setTimeout(() => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
      }, TOAST_MS)
    }
  }
  return { toasts, push }
}
