export const useBag = () => {
  const count = useState('bag', () => 0)
  const add = () => {
    count.value += 1
  }
  return { count, add }
}
