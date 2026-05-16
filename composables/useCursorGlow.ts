import { onMounted, onBeforeUnmount, ref } from 'vue'

export function useCursorGlow() {
  const mouseX = ref(0)
  const mouseY = ref(0)
  const isActive = ref(false)

  function onMouseMove(e: MouseEvent) {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
    isActive.value = true
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    window.addEventListener('mousemove', onMouseMove, { passive: true })
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('mousemove', onMouseMove)
  })

  return { mouseX, mouseY, isActive }
}
