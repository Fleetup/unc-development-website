import { onMounted } from 'vue'
import { createTimeline, utils } from 'animejs'

interface HeroIntroRefs {
  nameEl?: HTMLElement | null
  statusPill: HTMLElement | null
  wordEls: HTMLElement[]
  underlinePath: SVGPathElement | null
  subhead: HTMLElement | null
  liveIndicator: HTMLElement | null
  ctaEls: HTMLElement[]
  statsContainer: HTMLElement | null
  statNumbers: HTMLElement[]
  // H5 screenshot stack
  screenshotStack?: HTMLElement | null
  onStackIntroComplete?: () => void
}

export function useHeroIntro(getRefs: () => HeroIntroRefs) {
  onMounted(() => {
    requestAnimationFrame(() => {
      const prefersReduced = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const refs = getRefs()

      if (prefersReduced) {
        const allEls = [
          refs.nameEl ?? null,
          refs.statusPill,
          ...refs.wordEls,
          refs.subhead,
          refs.liveIndicator,
          ...refs.ctaEls,
          refs.statsContainer,
          refs.screenshotStack ?? null,
        ].filter(Boolean) as HTMLElement[]

        allEls.forEach((el) => {
          el.style.opacity = '1'
          el.style.transform = ''
        })

        refs.statNumbers.forEach((el) => {
          const target = el.dataset.target ?? ''
          const suffix = el.dataset.suffix ?? ''
          const prefix = el.dataset.prefix ?? ''
          el.textContent = prefix + target + suffix
        })
        return
      }

      const tl = createTimeline({ defaults: { ease: 'outExpo' } })

      // 0. Personal byline — appears first as a subtle brand mark
      if (refs.nameEl) {
        tl.add(refs.nameEl, {
          opacity: [0, 1],
          translateY: [-6, 0],
          duration: 500,
        }, 0)
      }

      // 1. Status pill
      if (refs.statusPill) {
        tl.add(refs.statusPill, {
          opacity: [0, 1],
          translateY: [-10, 0],
          duration: 600,
        }, 200)
      }

      // 2. Headline words — staggered slide-up
      if (refs.wordEls.length) {
        tl.add(refs.wordEls, {
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 600,
          delay: utils.stagger(80),
        }, 300)
      }

      // 3. SVG underline draw-in
      if (refs.underlinePath) {
        const len = 500
        refs.underlinePath.style.strokeDasharray = `${len}`
        refs.underlinePath.style.strokeDashoffset = `${len}`
        tl.add(refs.underlinePath, {
          strokeDashoffset: [len, 0],
          duration: 600,
          ease: 'outQuart',
        }, 540)
      }

      // 4. Subhead
      if (refs.subhead) {
        tl.add(refs.subhead, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
        }, 740)
      }

      // 5. Live indicator
      if (refs.liveIndicator) {
        tl.add(refs.liveIndicator, {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 500,
        }, 1140)
      }

      // 6. CTAs
      if (refs.ctaEls.length) {
        tl.add(refs.ctaEls, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          delay: utils.stagger(100),
        }, 1340)
      }

      // 7. Stats container
      if (refs.statsContainer) {
        tl.add(refs.statsContainer, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
        }, 1540)
      }

      // 8. Screenshot stack container — 1700ms
      if (refs.screenshotStack) {
        tl.add(refs.screenshotStack, {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 600,
          ease: 'outExpo',
        }, 1700)
        // Fire onStackIntroComplete at 2200ms so stack can start its cycle timer
        if (refs.onStackIntroComplete) {
          setTimeout(refs.onStackIntroComplete, 2200)
        }
      }

      // 7b. Number count-ups — run in parallel with stats container
      refs.statNumbers.forEach((el) => {
        const raw = el.dataset.target ?? ''
        const suffix = el.dataset.suffix ?? ''
        const prefix = el.dataset.prefix ?? ''
        const numeric = parseInt(raw, 10)
        if (isNaN(numeric)) {
          // non-numeric: just reveal it at its final value
          setTimeout(() => { el.textContent = prefix + raw + suffix }, 1540)
          return
        }
        const obj = { val: 0 }
        tl.add(obj, {
          val: [0, numeric],
          duration: 1200,
          ease: 'outExpo',
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.val) + suffix
          },
          onComplete: () => {
            el.textContent = prefix + numeric + suffix
          },
        }, 1540)
      })
    })
  })
}
