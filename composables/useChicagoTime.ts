import { onMounted, onBeforeUnmount, ref } from 'vue'

export function useChicagoTime() {
  const time = ref('')

  function update() {
    time.value = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date())
  }

  let interval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    update()
    interval = setInterval(update, 1000)
  })

  onBeforeUnmount(() => {
    if (interval !== null) clearInterval(interval)
  })

  return { time }
}
