/**
 * Lenis smooth scroll — site-wide.
 * Client-only plugin: runs on the browser, never SSR.
 * Honors prefers-reduced-motion (no init at all).
 * Patches the global anchor click handler so #anchor links still smooth-scroll
 * even though we're hijacking native scroll behavior.
 */
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const lenis = new Lenis({
    duration: 1.15,
    // Soft easing — gentler than the default cubic for a more "premium" deceleration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    // Touch scrolling stays native — feels weird on phones if hijacked
    syncTouch: false,
  })

  // Marker class lets us scope cursor / scroll-driven styles
  document.documentElement.classList.add('has-lenis')

  function raf(time: number): void {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // Intercept clicks on in-page anchors so Lenis handles the scroll instead
  // of the browser's native jump.
  function onAnchorClick(e: MouseEvent): void {
    const target = e.target as HTMLElement | null
    const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href || href === '#') return

    const id = href.slice(1)
    const el = document.getElementById(id)
    if (!el) return

    e.preventDefault()
    lenis.scrollTo(el, { offset: 0, duration: 1.2 })
    // Update URL hash without triggering a re-scroll
    history.pushState(null, '', href)
  }

  document.addEventListener('click', onAnchorClick, { passive: false })

  // Expose for components that need to imperatively scroll
  return {
    provide: { lenis },
  }
})
