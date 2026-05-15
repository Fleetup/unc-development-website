<template>
  <section id="contact" class="py-32 scroll-mt-20">
    <p class="text-caption uppercase tracking-widest text-[var(--color-accent)] mb-6">
      Contact
    </p>

    <h2 class="font-display text-display-lg text-[var(--color-ink)]">
      Let's build something.
    </h2>

    <p class="text-body-lg text-[var(--color-muted)] mt-4 max-w-2xl">
      Tell me what you're working on. I respond within 24 hours.
    </p>

    <form
      class="mt-16 max-w-xl space-y-10"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <div class="flex flex-col gap-2">
        <label for="name" class="text-caption uppercase tracking-widest text-[var(--color-muted)]">
          Name
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          class="w-full border-b border-[var(--color-border)] text-[var(--color-ink)] py-4 focus:border-[var(--color-accent)] transition-colors duration-200 bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="email" class="text-caption uppercase tracking-widest text-[var(--color-muted)]">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          class="w-full border-b border-[var(--color-border)] text-[var(--color-ink)] py-4 focus:border-[var(--color-accent)] transition-colors duration-200 bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="projectType" class="text-caption uppercase tracking-widest text-[var(--color-muted)]">
          Project type
        </label>
        <select
          id="projectType"
          v-model="form.projectType"
          class="w-full border-b border-[var(--color-border)] text-[var(--color-ink)] py-4 focus:border-[var(--color-accent)] transition-colors duration-200 bg-transparent cursor-pointer"
        >
          <option value="" disabled>Select a service...</option>
          <option value="mvp-build">MVP Build</option>
          <option value="hourly-development">Hourly Development</option>
          <option value="codebase-audit">Codebase Audit</option>
          <option value="ai-integration">AI Integration</option>
          <option value="monthly-retainer">Monthly Retainer</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label for="message" class="text-caption uppercase tracking-widest text-[var(--color-muted)]">
          Message
        </label>
        <textarea
          id="message"
          v-model="form.message"
          rows="5"
          class="w-full border-b border-[var(--color-border)] text-[var(--color-ink)] py-4 focus:border-[var(--color-accent)] transition-colors duration-200 bg-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        class="inline-flex items-center px-8 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm font-medium hover:bg-[var(--color-accent)] transition-colors duration-200"
      >
        Send message
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface ContactForm {
  name: string
  email: string
  projectType: string
  message: string
}

const form = reactive<ContactForm>({
  name: '',
  email: '',
  projectType: '',
  message: '',
})

function handleSubmit(): void {
  console.log('Contact form submitted:', { ...form })
}
</script>
