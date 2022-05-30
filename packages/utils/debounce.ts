// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <F extends (...args: any[]) => any>(fn: F, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => fn(...args), delay)
  }

  return debounced as (...args: Parameters<F>) => ReturnType<F>
}
