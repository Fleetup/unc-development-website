import { onMounted, onBeforeUnmount, type Ref } from 'vue'

interface TiltOptions {
  /** Max tilt in degrees on each axis. Default 8. */
  max?: number
  /** Skip on touch / coarse pointers. Default true. */
  skipTouch?: boolean
  /** RAF-throttled mousemove for buttery 60fps. Default true. */
  throttle?: boolean
}

/**
 * Cursor-tracking 3D tilt for a single element.
 * Writes --tilt-x / --tilt-y CSS custom properties; the element's own CSS
 * applies them in a `transform: perspective(N) rotateX rotateY`.
 *
 * Smooth easing on mouseleave is handled by a CSS transition on the host.
 */
export function useTilt(
  target: Ref<HTMLElement | null>,
  options: TiltOptions = {},
): void {
  const { max = 8, skipTouch = true, throttle = true } = options

  let cleanup: (() => void) | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (skipTouch && window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = target.value
    if (!el) return

    let rafId: number | null = null
    let pendingX = 0
    let pendingY = 0

    function apply(): void {
      el!.style.setProperty('--tilt-x', `${pendingY.toFixed(2)}deg`)
      el!.style.setProperty('--tilt-y', `${pendingX.toFixed(2)}deg`)
      rafId = null
    }

    function onMove(e: MouseEvent): void {
      const rect = el!.getBoundingClientRect()
      // Map cursor into [-0.5 … 0.5], then scale to max degrees.
      // X axis cursor → Y rotation; Y axis cursor → X rotation (inverted).
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      pendingX = nx * max
      pendingY = -ny * max

      if (throttle) {
        if (rafId === null) rafId = requestAnimationFrame(apply)
      } else {
        apply()
      }
    }

    function onLeave(): void {
      pendingX = 0
      pendingY = 0
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      el!.style.setProperty('--tilt-x', `0deg`)
      el!.style.setProperty('--tilt-y', `0deg`)
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })

    cleanup = () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  })

  onBeforeUnmount(() => {
    cleanup?.()
    cleanup = null
  })
}
