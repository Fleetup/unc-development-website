import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

interface ScrollRevealOptions {
  delay?: number
  threshold?: number
  rootMargin?: string
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { delay = 0, threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = options

  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      isVisible.value = true
      return
    }

    if (!el.value || typeof IntersectionObserver === 'undefined') {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer?.disconnect()
            observer = null
            break
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  const style = computed(() => ({
    transitionDelay: `${delay}ms`,
  }))

  return { el, isVisible, style }
}
