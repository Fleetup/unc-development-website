import { onMounted, onBeforeUnmount, type Ref } from 'vue'

interface SpotlightOptions {
  /** Skip on touch / coarse pointers (no real cursor). Default true. */
  skipTouch?: boolean
}

/**
 * Wires a mousemove listener on `target` that writes the cursor position
 * (in element-local px) to two CSS custom properties:
 *   --mouse-x, --mouse-y
 *
 * The card's own CSS uses these vars in a radial-gradient pseudo-element to
 * render a soft accent spotlight that follows the cursor. Pattern used by
 * Linear, Resend, Vercel, etc.
 *
 * Pass an array ref to wire spotlight on many elements at once (e.g., a
 * v-for list of cards).
 */
export function useSpotlight(
  target: Ref<HTMLElement | HTMLElement[] | null>,
  options: SpotlightOptions = {},
): void {
  const { skipTouch = true } = options

  let cleanups: Array<() => void> = []

  function wire(el: HTMLElement): () => void {
    function onMove(e: MouseEvent): void {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }
    function onLeave(): void {
      // Park the spotlight off-element so the gradient fades naturally
      el.style.setProperty('--mouse-x', `-9999px`)
      el.style.setProperty('--mouse-y', `-9999px`)
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (skipTouch && window.matchMedia('(pointer: coarse)').matches) return

    const value = target.value
    const elements = Array.isArray(value) ? value : value ? [value] : []
    cleanups = elements.filter(Boolean).map(wire)
  })

  onBeforeUnmount(() => {
    cleanups.forEach((c) => c())
    cleanups = []
  })
}
