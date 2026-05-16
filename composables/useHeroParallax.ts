import { onMounted, onBeforeUnmount, type Ref } from 'vue'

interface FrameRefs {
  macbook: HTMLElement | null
  phone: HTMLElement | null
  leftCol: HTMLElement | null
}

interface BaseTilts {
  macbook: { rotateY: number; rotateX: number }
  phone: { rotateY: number; rotateX: number }
}

export function useHeroParallax(
  heroRef: Ref<HTMLElement | null>,
  getFrames: () => FrameRefs,
  baseTilts: BaseTilts,
) {
  // Scroll parallax translateY offsets (px at full scroll)
  const SCROLL_OFFSETS = { macbook: -25, phone: -50 }

  // Mouse parallax max additional degrees on top of base tilt
  const MOUSE_MAX = {
    macbook: { y: 4, x: 2 },
    phone: { y: 7, x: 3 },
  }

  // Ambient float amplitudes (px) and drift amplitudes (deg)
  const AMBIENT = {
    macbook: { floatAmp: 6, floatPeriod: 7000, driftAmp: 0.8, driftPeriod: 9000 },
    phone:   { floatAmp: 8, floatPeriod: 5000, driftAmp: 1.2, driftPeriod: 7000 },
  }

  const LERP_FACTOR = 0.08

  let mouseCurrent = { x: 0, y: 0 }
  let mouseTarget = { x: 0, y: 0 }
  let scrollProgress = 0
  let ambientRafId: number | null = null
  let isMouseInHero = false

  let isTouch = false
  let isReduced = false

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  // Continuous ambient loop — runs at 60fps always (not just on mouse move)
  function ambientLoop() {
    const frames = getFrames()
    const now = performance.now()

    const setTransform = (
      el: HTMLElement | null,
      baseRY: number,
      baseRX: number,
      mouseMaxY: number,
      mouseMaxX: number,
      scrollOffset: number,
      amb: typeof AMBIENT.macbook,
    ) => {
      if (!el) return

      // Mouse parallax delta (lerped)
      const addRY = mouseCurrent.x * mouseMaxY
      const addRX = -mouseCurrent.y * mouseMaxX

      // Scroll translateY
      const translateY = scrollProgress * scrollOffset

      // Ambient: sine-wave vertical float
      const floatY = isReduced
        ? 0
        : Math.sin((now / amb.floatPeriod) * Math.PI * 2) * amb.floatAmp

      // Ambient: slow rotation drift (adds to rotateY)
      const driftRY = isReduced
        ? 0
        : Math.sin((now / amb.driftPeriod) * Math.PI * 2) * amb.driftAmp

      el.style.transform = [
        `rotateY(${baseRY + addRY + driftRY}deg)`,
        `rotateX(${baseRX + addRX}deg)`,
        `translateY(${translateY + floatY}px)`,
      ].join(' ')
    }

    setTransform(
      frames.macbook,
      baseTilts.macbook.rotateY, baseTilts.macbook.rotateX,
      MOUSE_MAX.macbook.y, MOUSE_MAX.macbook.x,
      SCROLL_OFFSETS.macbook,
      AMBIENT.macbook,
    )
    setTransform(
      frames.phone,
      baseTilts.phone.rotateY, baseTilts.phone.rotateX,
      MOUSE_MAX.phone.y, MOUSE_MAX.phone.x,
      SCROLL_OFFSETS.phone,
      AMBIENT.phone,
    )

    // Lerp mouse toward target each frame
    mouseCurrent.x = lerp(mouseCurrent.x, mouseTarget.x, LERP_FACTOR)
    mouseCurrent.y = lerp(mouseCurrent.y, mouseTarget.y, LERP_FACTOR)

    // Left column scroll fade
    if (frames.leftCol) {
      frames.leftCol.style.opacity = String(Math.max(0.3, 1 - scrollProgress * 0.7))
    }

    ambientRafId = requestAnimationFrame(ambientLoop)
  }

  function onMouseMove(e: MouseEvent) {
    if (isTouch || isReduced) return
    const hero = heroRef.value
    if (!hero) return
    const rect = hero.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseTarget.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)))
    mouseTarget.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)))
  }

  function onMouseEnterHero() {
    isMouseInHero = true
  }

  function onMouseLeaveHero() {
    isMouseInHero = false
    mouseTarget.x = 0
    mouseTarget.y = 0
  }

  // ─── Scroll parallax ─────────────────────────────────────────────
  let scrollRafQueued = false

  function onScroll() {
    if (scrollRafQueued) return
    scrollRafQueued = true
    requestAnimationFrame(() => {
      scrollRafQueued = false
      const hero = heroRef.value
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const heroH = hero.offsetHeight
      scrollProgress = isReduced
        ? 0
        : Math.max(0, Math.min(1, -rect.top / heroH))
    })
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    isTouch = window.matchMedia('(pointer: coarse)').matches
    isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const hero = heroRef.value
    if (hero) {
      hero.addEventListener('mouseenter', onMouseEnterHero)
      hero.addEventListener('mouseleave', onMouseLeaveHero)
      hero.addEventListener('mousemove', onMouseMove, { passive: true })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Start the continuous ambient loop
    ambientRafId = requestAnimationFrame(ambientLoop)
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    const hero = heroRef.value
    if (hero) {
      hero.removeEventListener('mouseenter', onMouseEnterHero)
      hero.removeEventListener('mouseleave', onMouseLeaveHero)
      hero.removeEventListener('mousemove', onMouseMove)
    }
    window.removeEventListener('scroll', onScroll)
    if (ambientRafId !== null) cancelAnimationFrame(ambientRafId)
  })
}
