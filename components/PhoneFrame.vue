<template>
  <div
    class="relative inline-block"
    :style="containerStyle"
  >
    <!-- Accent glow behind frame -->
    <div
      v-if="glow"
      class="absolute pointer-events-none"
      style="
        inset: -40px;
        border-radius: 50%;
        background: radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255,92,31,0.18), transparent 70%);
        z-index: 0;
      "
      aria-hidden="true"
    />

    <!--
      Screen content slot — absolutely positioned behind the inline SVG.
      The SVG's .st66 screen fill is overridden to transparent, so slot
      content shows through the cutout.
      SVG viewBox: 0 0 232.57 485.6
      Screen area: x=22.2 y=6.66 w=205.35 h=471.76
      Percentages: left=9.55% top=1.37% width=88.3% height=97.15%
    -->
    <div
      class="absolute overflow-hidden"
      style="
        left: 9.55%;
        top: 1.37%;
        width: 88.3%;
        height: 97.15%;
        border-radius: 12%;
        background: #0A0A0F;
        z-index: 1;
      "
      aria-label="Screen content"
    >
      <slot>
        <!-- Default placeholder -->
        <div
          class="w-full h-full flex items-center justify-center"
          style="background: linear-gradient(160deg, #1a0a2e 0%, #0A0A0F 60%);"
        >
          <span style="font-family: var(--font-mono); font-size: 13px; color: rgba(255,255,255,0.3);">preview</span>
        </div>
      </slot>
    </div>

    <!--
      Inline SVG device frame — .st66 overridden to transparent so screen slot shows through.
      z-index:2 so bezels render on top of slot content.
    -->
    <div
      v-if="svgContent"
      class="absolute inset-0 w-full h-full"
      style="z-index: 2; pointer-events: none;"
      aria-hidden="true"
      v-html="svgContent"
    />
    <!-- Fallback img while SVG loads -->
    <img
      v-else
      src="/frames/Phone.svg"
      alt=""
      draggable="false"
      class="absolute inset-0 w-full h-full"
      style="z-index: 2; pointer-events: none; user-select: none; display: block;"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tilt {
  rotateY?: number
  rotateX?: number
}

const props = withDefaults(defineProps<{
  tilt?: Tilt
  glow?: boolean
  width?: string
}>(), {
  tilt: () => ({ rotateY: 0, rotateX: 0 }),
  glow: false,
  width: '280px',
})

// Fetch pre-transformed SVG from server route (/api/frames/phone).
// The route reads Phone.svg, sets .st66 fill to none, and returns SVG text.
// This works in both SSR and CSR contexts.
const { data: svgContent } = await useFetch<string>('/api/frames/phone', {
  key: 'phone-svg',
  parseResponse: (txt: string) => {
    // Ensure the inline SVG scales to fill its container div
    return txt.replace('<svg ', '<svg style="width:100%;height:100%;display:block;" ')
  },
})

const containerStyle = computed(() => {
  const ry = props.tilt?.rotateY ?? 0
  const rx = props.tilt?.rotateX ?? 0
  return {
    width: props.width,
    aspectRatio: '232.57 / 485.6',
    display: 'block',
    position: 'relative' as const,
    transform: `rotateY(${ry}deg) rotateX(${rx}deg)`,
    transformStyle: 'preserve-3d' as const,
    willChange: 'transform',
  }
})
</script>
