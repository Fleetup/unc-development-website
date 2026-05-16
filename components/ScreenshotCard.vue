<template>
  <div
    class="screenshot-card"
    :class="{ 'is-mobile': type === 'mobile' }"
    :aria-label="ariaLabel"
    role="button"
    tabindex="0"
    @keydown.enter.prevent="$emit('activate')"
    @keydown.space.prevent="$emit('activate')"
  >
    <!-- Web variant: browser chrome + screenshot -->
    <template v-if="type === 'web'">
      <div class="chrome chrome--browser">
        <div class="traffic-lights" aria-hidden="true">
          <span class="dot dot--red" />
          <span class="dot dot--yellow" />
          <span class="dot dot--green" />
        </div>
        <div class="url-bar">
          <span class="url-label">{{ label }}</span>
        </div>
        <div class="chrome-right" aria-hidden="true" />
      </div>

      <div class="screenshot-area">
        <img
          :src="src"
          :alt="ariaLabel"
          class="screenshot-img"
          loading="lazy"
          draggable="false"
        />
      </div>
    </template>

    <!-- Mobile variant: flat, head-on iPhone-style frame.
         (PhoneFrame.vue is drawn in 3D perspective which doesn't match
         a flat screenshot, so we build the frame inline here.) -->
    <div v-else class="phone-stage">
      <div class="phone-frame">
        <div class="phone-bezel">
          <div class="phone-screen">
            <img
              :src="src"
              :alt="ariaLabel"
              class="phone-screen-img"
              loading="lazy"
              draggable="false"
            />
            <div class="phone-island" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  label: string
  type: 'web' | 'mobile'
  ariaLabel: string
}>()

defineEmits<{
  activate: []
}>()
</script>

<style scoped>
.screenshot-card {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-surface);
  box-shadow:
    /* Cast shadow */
    0 24px 50px -12px rgba(0, 0, 0, 0.6),
    0 10px 18px -4px rgba(0, 0, 0, 0.35),
    /* Inner highlight */
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
    /* Ambient accent glow — parity with phone-frame variant */
    0 0 60px -8px rgba(255, 92, 31, 0.18);
  display: flex;
  flex-direction: column;
  outline: none;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}

.screenshot-card:focus-visible {
  box-shadow:
    0 24px 50px -12px rgba(0, 0, 0, 0.6),
    0 10px 18px -4px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 0 2px var(--color-accent);
}

/* Mobile variant: no card shell — the phone IS the visual */
.screenshot-card.is-mobile {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  overflow: visible;
}

.screenshot-card.is-mobile:focus-visible {
  box-shadow: none;
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: 24px;
}

/* ── Chrome bars ── */
.chrome {
  height: 28px;
  flex-shrink: 0;
  background: var(--color-surface-elevated);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
}

.chrome--browser {
  justify-content: space-between;
}

.chrome--mobile {
  justify-content: center;
}

/* Traffic lights */
.traffic-lights {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.65;
}

.dot--red    { background: #FF5F57; }
.dot--yellow { background: #FEBC2E; }
.dot--green  { background: #28C840; }

/* URL bar */
.url-bar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 8px;
}

.url-label {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  color: var(--color-text-dim);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.chrome-right {
  width: 52px;
  flex-shrink: 0;
}

/* Mobile chrome label */
.mobile-label {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  color: var(--color-text-dim);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ── Screenshot area ── */
.screenshot-area {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.screenshot-area--mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  padding: 0 40px;
}

.screenshot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.screenshot-img--mobile {
  width: auto;
  height: 100%;
  max-width: 100%;
  object-fit: contain;
}

/* ── Phone-frame variant ─────────────────────────────────────────────────── */
.phone-stage {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: visible;
}

/* Phone body — matches iPhone 15 Pro aspect (9 : 19.5 ≈ 0.4615),
   so the 1206×2622 screenshot fits exactly with no skew. */
.phone-frame {
  position: relative;
  height: 96%;
  aspect-ratio: 9 / 19.5;
  border-radius: 14% / 6.5%;
  background:
    linear-gradient(160deg, #2A2A2E 0%, #1A1A1D 45%, #2A2A2E 100%);
  padding: 2.8%;
  box-shadow:
    /* Subtle inner highlight on body */
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    /* Cast shadow */
    0 28px 50px -10px rgba(0, 0, 0, 0.6),
    0 12px 24px -6px rgba(0, 0, 0, 0.4),
    /* Ambient accent glow */
    0 0 60px -8px rgba(255, 92, 31, 0.18);
}

/* Inner bezel — thin dark ring between body and screen */
.phone-bezel {
  position: absolute;
  inset: 2.8%;
  border-radius: 11% / 5.2%;
  background: #050507;
  padding: 1px;
}

/* Screen — image clipped to rounded rect */
.phone-screen {
  position: absolute;
  inset: 0;
  border-radius: 11% / 5.2%;
  overflow: hidden;
  background: #0A0A0F;
}

.phone-screen-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

/* Dynamic Island — pill at the top of the screen */
.phone-island {
  position: absolute;
  top: 2.2%;
  left: 50%;
  transform: translateX(-50%);
  width: 32%;
  height: 3.4%;
  background: #000;
  border-radius: 999px;
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.06);
  z-index: 2;
  pointer-events: none;
}
</style>
