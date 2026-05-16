import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useMagneticCursor(elRef: Ref<HTMLElement | null>) {
  const MAX_TRANSLATE = 8
  const STRENGTH = 0.25
  const ACTIVATION_RADIUS = 60

  let rafId: number | null = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let isActive = false

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  function clamp(val: number, min: number, max: number) {
    return Math.min(max, Math.max(min, val))
  }

  function loop() {
    currentX = lerp(currentX, targetX, 0.12)
    currentY = lerp(currentY, targetY, 0.12)

    if (elRef.value) {
      elRef.value.style.transform = `translate(${currentX}px, ${currentY}px)`
    }

    rafId = requestAnimationFrame(loop)
  }

  function onMouseMove(e: MouseEvent) {
    const el = elRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const threshold = Math.max(rect.width, rect.height) / 2 + ACTIVATION_RADIUS

    if (dist < threshold) {
      if (!isActive) {
        isActive = true
        if (!rafId) rafId = requestAnimationFrame(loop)
      }
      targetX = clamp(dx * STRENGTH, -MAX_TRANSLATE, MAX_TRANSLATE)
      targetY = clamp(dy * STRENGTH, -MAX_TRANSLATE, MAX_TRANSLATE)
    } else {
      targetX = 0
      targetY = 0
      if (isActive && Math.abs(currentX) < 0.1 && Math.abs(currentY) < 0.1) {
        isActive = false
      }
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || isReduced) return

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafId = requestAnimationFrame(loop)
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('mousemove', onMouseMove)
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  })
}
