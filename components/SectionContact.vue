<template>
  <!--
    Contact section — same design rhythm as hero / about / work / services / process:
    - Eyebrow pill with accent pulse dot
    - Two-tone headline
    - Mono subhead
    - Atmospheric background + top divider
    - Apple HIG-aligned spacing on 8pt grid
    - Premium form with idle/sending/success/error states
    - Sidebar with availability, response time, location, direct email
  -->
  <section
    id="contact"
    class="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)]
           py-24 md:py-32 lg:py-40
           px-6 md:px-8 lg:px-16"
  >
    <!-- ── Background atmosphere ────────────────────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Soft accent blob, top-right -->
      <div
        class="absolute"
        style="top: -8%; right: -8%; width: 720px; height: 720px;
               background: #FF5C1F; opacity: 0.04;
               filter: blur(140px); border-radius: 50%;
               animation: blob-drift-1 36s ease-in-out infinite;
               will-change: transform;"
      />
      <!-- Faint grid -->
      <div
        class="absolute inset-0"
        style="background-image:
                 linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px);
               background-size: 80px 80px;
               mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 100%);
               -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 100%);"
      />
    </div>

    <!-- Top divider -->
    <div
      class="absolute top-0 left-0 right-0 h-px pointer-events-none"
      aria-hidden="true"
      style="background: linear-gradient(90deg, transparent, var(--color-border-strong) 50%, transparent);"
    />

    <div class="relative z-10 max-w-7xl mx-auto">

      <!-- ── Eyebrow ─────────────────────────────────────────────────── -->
      <p
        ref="eyebrowEl"
        class="reveal inline-flex items-center gap-2.5 font-mono text-caption uppercase tracking-widest text-[var(--color-accent)]"
        :class="{ 'is-visible': eyebrowVisible }"
        :style="eyebrowStyle"
      >
        <span class="pulse-dot" style="background-color: var(--color-accent);" aria-hidden="true" />
        CONTACT · 06
      </p>

      <!-- ── Headline ────────────────────────────────────────────────── -->
      <h2
        class="mt-6 md:mt-8
               text-[2.5rem] sm:text-5xl md:text-6xl lg:text-display-lg
               font-medium tracking-tight leading-[1.05]
               text-[var(--color-text)] max-w-4xl"
      >
        <SplitText
          tag="span"
          text="Let's build something."
          split="chars"
          :stagger="18"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
        <br />
        <SplitText
          tag="span"
          class="text-[var(--color-text-muted)]"
          text="Tell me what you're working on."
          split="chars"
          :stagger="14"
          :delay="320"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
      </h2>

      <!-- ── Subhead ─────────────────────────────────────────────────── -->
      <p
        ref="leadEl"
        class="reveal mt-8 font-mono text-[0.9375rem] md:text-body-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed"
        :class="{ 'is-visible': leadVisible }"
        :style="leadStyle"
      >
        I respond within 24 hours, usually under 4. No agency calls, no qualification
        gauntlet — just a reply with next steps.
      </p>

      <!-- ── Form + Sidebar grid ──────────────────────────────────────── -->
      <div class="mt-16 md:mt-20 lg:mt-24 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        <!-- Form column (lg: 7 of 12) -->
        <form
          class="lg:col-span-7"
          novalidate
          @submit.prevent="handleSubmit"
        >
          <!-- Honeypot — invisible to humans, attracts spam bots -->
          <div class="honeypot" aria-hidden="true">
            <label for="company">Company (leave empty)</label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <fieldset :disabled="status === 'sending' || status === 'success'" class="space-y-6 md:space-y-7">
            <!-- Name + Email row -->
            <div class="grid sm:grid-cols-2 gap-6 md:gap-7">
              <div class="field">
                <label for="name" class="field-label">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  autocomplete="name"
                  placeholder="Your name"
                  class="field-input"
                  :class="{ 'has-error': errors.name }"
                  required
                  @blur="validateField('name')"
                />
                <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
              </div>

              <div class="field">
                <label for="email" class="field-label">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  class="field-input"
                  :class="{ 'has-error': errors.email }"
                  required
                  @blur="validateField('email')"
                />
                <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
              </div>
            </div>

            <!-- Project type -->
            <div class="field">
              <label for="projectType" class="field-label">Project type</label>
              <select
                id="projectType"
                v-model="form.projectType"
                class="field-input field-select"
                :class="{ 'has-error': errors.projectType }"
                @blur="validateField('projectType')"
              >
                <option value="" disabled>Select a service…</option>
                <option value="mvp-build">MVP Build</option>
                <option value="web-app">Web App Development</option>
                <option value="mobile-app">Mobile App Development</option>
                <option value="monthly-retainer">Monthly Retainer</option>
                <option value="codebase-audit">Codebase Audit &amp; Roadmap</option>
                <option value="ai-integration">AI Integration Sprint</option>
                <option value="other">Something else</option>
              </select>
              <p v-if="errors.projectType" class="field-error">{{ errors.projectType }}</p>
            </div>

            <!-- Message -->
            <div class="field">
              <label for="message" class="field-label">
                Message
                <span class="field-label-hint">{{ form.message.length }} / 2000</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                maxlength="2000"
                placeholder="Tell me about your project — what you're building, your timeline, anything I should know."
                class="field-input field-textarea"
                :class="{ 'has-error': errors.message }"
                required
                @blur="validateField('message')"
              />
              <p v-if="errors.message" class="field-error">{{ errors.message }}</p>
            </div>

            <!-- Submit row -->
            <div class="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                class="submit-btn"
                :class="{ 'is-sending': status === 'sending', 'is-success': status === 'success' }"
                :disabled="status === 'sending' || status === 'success'"
              >
                <span class="submit-label">
                  <template v-if="status === 'sending'">Sending…</template>
                  <template v-else-if="status === 'success'">Message sent</template>
                  <template v-else>Send message</template>
                </span>
                <span class="submit-icon" aria-hidden="true">
                  <svg v-if="status === 'sending'" class="spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5" opacity="0.25" />
                    <path d="M12.5 7a5.5 5.5 0 0 0-5.5-5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <svg v-else-if="status === 'success'" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l2.5 2.5L11 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <IconArrow v-else />
                </span>
              </button>

              <p
                v-if="status === 'success'"
                class="font-mono text-caption text-[var(--color-success)]"
                role="status"
              >
                Thanks. I'll reply within 24 hours.
              </p>
              <p
                v-else-if="status === 'error'"
                class="font-mono text-caption text-red-400"
                role="alert"
              >
                {{ errorMessage }}
              </p>
            </div>
          </fieldset>
        </form>

        <!-- Info sidebar (lg: 4 of 12, offset 1) -->
        <aside class="lg:col-span-4 lg:col-start-9">
          <ul class="info-list">

            <li class="info-card">
              <div class="info-card-row">
                <span class="pulse-dot" aria-hidden="true" />
                <span class="info-card-label" style="color: var(--color-success);">
                  Available for projects
                </span>
              </div>
              <p class="info-card-body">Booking new work starting June 2026.</p>
            </li>

            <li class="info-card">
              <p class="info-card-label">Typical response time</p>
              <p class="info-card-value">&lt; 4 hours</p>
              <p class="info-card-body">Mon–Fri · 9am–6pm CT</p>
            </li>

            <li class="info-card">
              <p class="info-card-label">Based in</p>
              <p class="info-card-value">Addison, IL</p>
              <p class="info-card-body">Chicago metro · remote-first · clients globally</p>
            </li>

            <li class="info-card">
              <p class="info-card-label">Or email directly</p>
              <a
                href="mailto:developmentteam@uncdevelopment.com"
                class="info-card-link"
              >
                developmentteam@uncdevelopment.com
                <IconArrow />
              </a>
            </li>

          </ul>
        </aside>

      </div>
    </div>

    <!-- Bottom divider -->
    <div
      class="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
      aria-hidden="true"
      style="background: linear-gradient(90deg, transparent, var(--color-border-strong) 50%, transparent);"
    />
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

interface ContactForm {
  name: string
  email: string
  projectType: string
  message: string
  company: string  // honeypot
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const form = reactive<ContactForm>({
  name: '',
  email: '',
  projectType: '',
  message: '',
  company: '',
})

const errors = reactive<Record<string, string>>({
  name: '',
  email: '',
  projectType: '',
  message: '',
})

const status = ref<Status>('idle')
const errorMessage = ref('')

// Track when the form first becomes interactive so the server can reject
// submissions faster than humans can plausibly fill the form (bot signal).
const formOpenedAt = ref(0)
onMounted(() => {
  formOpenedAt.value = Date.now()
})

function validateField(field: keyof typeof errors): boolean {
  errors[field] = ''
  const v = (form as any)[field] as string

  if (field === 'name') {
    if (!v.trim()) errors.name = 'Please enter your name.'
  } else if (field === 'email') {
    if (!v.trim()) errors.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) errors.email = "That email doesn't look right."
  } else if (field === 'projectType') {
    if (!v) errors.projectType = 'Pick a project type.'
  } else if (field === 'message') {
    if (!v.trim()) errors.message = 'Tell me a bit about the project.'
    else if (v.trim().length < 10) errors.message = 'A few more details would help (10+ characters).'
  }
  return !errors[field]
}

function validateAll(): boolean {
  const fields: (keyof typeof errors)[] = ['name', 'email', 'projectType', 'message']
  let ok = true
  for (const f of fields) {
    if (!validateField(f)) ok = false
  }
  return ok
}

async function handleSubmit(): Promise<void> {
  if (status.value === 'sending' || status.value === 'success') return
  if (!validateAll()) return

  status.value = 'sending'
  errorMessage.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        projectType: form.projectType,
        message: form.message.trim(),
        company: form.company,           // honeypot — server rejects if filled
        formOpenedAt: formOpenedAt.value, // anti-bot fill-time check
      },
    })
    status.value = 'success'
  }
  catch (err: any) {
    status.value = 'error'
    errorMessage.value =
      err?.data?.statusMessage
      || err?.statusMessage
      || "Couldn't send right now. Email me directly instead."
  }
}

const { el: eyebrowEl, isVisible: eyebrowVisible, style: eyebrowStyle } = useScrollReveal({ delay: 0 })
const { el: leadEl,    isVisible: leadVisible,    style: leadStyle    } = useScrollReveal({ delay: 240 })
</script>

<style scoped>
/* ── Honeypot — visually hidden, off-screen, no a11y exposure ──────── */
.honeypot {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* ── Form fields ───────────────────────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.field-label-hint {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
}

.field-input {
  width: 100%;
  min-height: 48px;
  padding: 14px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.5;
  transition:
    border-color 200ms ease,
    background 200ms ease,
    box-shadow 200ms ease;
}

.field-input::placeholder {
  color: var(--color-text-dim);
}

.field-input:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface-elevated);
}

.field-input:focus {
  outline: none;
  border-color: var(--color-accent);
  background: var(--color-surface-elevated);
  box-shadow:
    0 0 0 3px rgba(255, 92, 31, 0.12),
    inset 0 0 0 1px rgba(255, 92, 31, 0.15);
}

.field-input.has-error {
  border-color: #EF4444;
}

.field-input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.field-textarea {
  min-height: 140px;
  resize: vertical;
}

.field-select {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--color-text-muted) 50%),
    linear-gradient(135deg, var(--color-text-muted) 50%, transparent 50%);
  background-position:
    calc(100% - 20px) center,
    calc(100% - 14px) center;
  background-size:
    6px 6px,
    6px 6px;
  background-repeat: no-repeat;
  padding-right: 40px;
}

.field-error {
  margin-top: 4px;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #F87171;
}

/* ── Submit button ──────────────────────────────────────────────────── */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 12px 24px;
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow:
    0 0 0 1px rgba(255, 92, 31, 0.3),
    0 0 40px -12px var(--color-accent),
    0 0 80px -24px var(--color-accent);
  transition:
    background 200ms ease,
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 200ms ease,
    opacity 200ms ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.submit-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.85;
}

.submit-btn.is-sending {
  background: var(--color-accent);
}

.submit-btn.is-success {
  background: var(--color-success);
  box-shadow:
    0 0 0 1px rgba(0, 193, 106, 0.3),
    0 0 40px -12px var(--color-success);
}

.submit-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spin {
  animation: submit-spin 0.9s linear infinite;
}

@keyframes submit-spin {
  to { transform: rotate(360deg); }
}

/* ── Sidebar ────────────────────────────────────────────────────────── */
.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px 4px;
  border-bottom: 1px solid var(--color-border);
  transition: background 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.info-card:last-child {
  border-bottom: none;
}

.info-card:hover {
  background: linear-gradient(90deg, rgba(255, 92, 31, 0.04), transparent 80%);
}

@media (min-width: 1024px) {
  .info-card {
    padding: 28px 8px;
  }
}

.info-card-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.info-card-label {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-dim);
}

.info-card-value {
  font-size: 1.5rem;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.info-card-body {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.info-card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, monospace);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  word-break: break-all;
  transition: color 200ms ease;
}

.info-card-link:hover {
  color: var(--color-accent);
}
</style>
