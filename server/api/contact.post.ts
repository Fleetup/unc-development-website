/**
 * Contact form endpoint — forwards submissions to Resend.
 *
 * Required env vars (also exposed via runtimeConfig in nuxt.config.ts):
 *   RESEND_API_KEY    — from https://resend.com/api-keys
 *   CONTACT_TO        — destination inbox
 *   CONTACT_FROM      — verified sender
 *
 * Anti-abuse defenses (in order of evaluation):
 *   1. Global cap — caps total submissions/hour across all IPs
 *   2. Per-IP limit + minimum interval (anti-burst)
 *   3. Honeypot field — bots that fill it get silent fake-success
 *   4. Per-email limit — same email can't spam from different IPs
 *   5. Form fill-time check — bots fill in <2s; humans take longer
 *
 * Deployment note: this endpoint requires a runtime that supports server
 * routes (Vercel, Netlify, Cloudflare Pages, Node server, etc.). Pure-static
 * hosting (S3, GH Pages) will not execute it.
 *
 * Rate-limit state is in-memory and per-process. For high-traffic
 * multi-instance deploys, swap the maps for Redis / KV / Upstash.
 */

interface ContactPayload {
  name?: string
  email?: string
  projectType?: string
  message?: string
  company?: string         // honeypot
  formOpenedAt?: number    // client timestamp (ms) when form mounted
}

// ── Limits ──────────────────────────────────────────────────────────────
const IP_MAX                = 3                    // submissions / window
const IP_WINDOW_MS          = 30 * 60 * 1000       // 30 minutes

const EMAIL_MAX             = 2                    // submissions / window
const EMAIL_WINDOW_MS       = 60 * 60 * 1000       // 1 hour

const GLOBAL_MAX            = 100                  // total / window across all IPs
const GLOBAL_WINDOW_MS      = 60 * 60 * 1000       // 1 hour

const MIN_INTERVAL_MS       = 10 * 1000            // 10s between submits per IP
const MIN_FILL_MS           = 2 * 1000             // human floor — bots fill faster
const MAX_FORM_AGE_MS       = 24 * 60 * 60 * 1000  // reject ancient form state

// Memory guards — caps map size to prevent memory-exhaustion attacks
const MAX_MAP_SIZE          = 5000
const CLEANUP_PROBABILITY   = 0.02                 // run cleanup ~2% of requests

interface LimitEntry {
  count: number
  resetAt: number
  lastAt: number
}

const ipMap    = new Map<string, LimitEntry>()
const emailMap = new Map<string, LimitEntry>()
let globalState: LimitEntry = { count: 0, resetAt: 0, lastAt: 0 }

function cleanupMap(map: Map<string, LimitEntry>): void {
  const now = Date.now()
  for (const [key, entry] of map) {
    if (entry.resetAt < now) map.delete(key)
  }
  // Hard cap: evict oldest entries if still over size limit
  if (map.size > MAX_MAP_SIZE) {
    const overflow = map.size - MAX_MAP_SIZE
    let removed = 0
    for (const key of map.keys()) {
      if (removed++ >= overflow) break
      map.delete(key)
    }
  }
}

type CheckResult =
  | { ok: true }
  | { ok: false; reason: 'too-fast' | 'limit' }

function checkLimit(
  map: Map<string, LimitEntry>,
  key: string,
  max: number,
  windowMs: number,
  minIntervalMs = 0,
): CheckResult {
  const now = Date.now()
  const entry = map.get(key)

  if (!entry || entry.resetAt < now) {
    map.set(key, { count: 1, resetAt: now + windowMs, lastAt: now })
    return { ok: true }
  }

  if (minIntervalMs > 0 && now - entry.lastAt < minIntervalMs) {
    return { ok: false, reason: 'too-fast' }
  }

  if (entry.count >= max) {
    return { ok: false, reason: 'limit' }
  }

  entry.count++
  entry.lastAt = now
  return { ok: true }
}

function checkGlobal(): boolean {
  const now = Date.now()
  if (globalState.resetAt < now) {
    globalState = { count: 1, resetAt: now + GLOBAL_WINDOW_MS, lastAt: now }
    return true
  }
  if (globalState.count >= GLOBAL_MAX) return false
  globalState.count++
  globalState.lastAt = now
  return true
}

// ── Utilities ──────────────────────────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function projectTypeLabel(slug: string): string {
  const map: Record<string, string> = {
    'mvp-build':        'MVP Build',
    'web-app':          'Web App Development',
    'mobile-app':       'Mobile App Development',
    'monthly-retainer': 'Monthly Retainer',
    'codebase-audit':   'Codebase Audit & Roadmap',
    'ai-integration':   'AI Integration Sprint',
    'other':            'Something else',
  }
  return map[slug] ?? slug
}

function clientIp(event: any): string {
  return (
    getRequestHeader(event, 'cf-connecting-ip')
    ?? getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    ?? getRequestHeader(event, 'x-real-ip')
    ?? event.node?.req?.socket?.remoteAddress
    ?? 'unknown'
  )
}

// ── Handler ────────────────────────────────────────────────────────────
export default defineEventHandler(async (event) => {
  // Opportunistic cleanup — runs probabilistically so it doesn't block
  // every request but still prevents unbounded growth.
  if (Math.random() < CLEANUP_PROBABILITY) {
    cleanupMap(ipMap)
    cleanupMap(emailMap)
  }

  // ── 1. Global cap (cheapest check — runs before anything else) ──────
  // Always run before config/body checks so attackers can't bypass
  // rate limiting by spamming when the service is unconfigured.
  if (!checkGlobal()) {
    console.warn('[contact] global rate limit hit')
    throw createError({
      statusCode: 503,
      statusMessage: 'Service is temporarily busy. Please email directly or try again later.',
    })
  }

  // ── 2. Per-IP limit + burst throttle ────────────────────────────────
  const ip = clientIp(event)
  const ipCheck = checkLimit(ipMap, ip, IP_MAX, IP_WINDOW_MS, MIN_INTERVAL_MS)
  if (!ipCheck.ok) {
    console.warn(`[contact] ip-limit hit ip=${ip} reason=${ipCheck.reason}`)
    throw createError({
      statusCode: 429,
      statusMessage: ipCheck.reason === 'too-fast'
        ? 'Slow down a moment — try again in 10 seconds.'
        : 'Too many requests. Please try again in 30 minutes or email directly.',
    })
  }

  // ── 3. Config check (after rate limits so DoS still gets throttled) ──
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey
  const toEmail = config.contactToEmail
  const fromEmail = config.contactFromEmail

  if (!apiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Email service is not configured.',
    })
  }

  // ── 4. Read body + honeypot ─────────────────────────────────────────
  const body = await readBody<ContactPayload>(event)

  // Honeypot — silently succeed for bots so they don't retry or learn
  if (body?.company && body.company.trim() !== '') {
    console.warn(`[contact] honeypot tripped ip=${ip}`)
    return { ok: true }
  }

  // ── 5. Validation ───────────────────────────────────────────────────
  const name = (body?.name ?? '').trim()
  const email = (body?.email ?? '').trim().toLowerCase()
  const projectType = (body?.projectType ?? '').trim()
  const message = (body?.message ?? '').trim()

  if (!name || name.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Please enter your name.' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    throw createError({ statusCode: 400, statusMessage: 'Please enter a valid email.' })
  }
  if (!projectType) {
    throw createError({ statusCode: 400, statusMessage: 'Please select a project type.' })
  }
  if (!message || message.length < 10 || message.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: 'Message must be 10–5000 characters.' })
  }

  // ── 6. Per-email limit ──────────────────────────────────────────────
  const emailCheck = checkLimit(emailMap, email, EMAIL_MAX, EMAIL_WINDOW_MS)
  if (!emailCheck.ok) {
    console.warn(`[contact] email-limit hit email=${email}`)
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many submissions from this email. Please email directly.',
    })
  }

  // ── 7. Form fill-time check (anti-bot) ──────────────────────────────
  // Humans take seconds to fill a form. Bots fill in milliseconds. If we
  // can verify, reject too-fast submissions silently (bots learn nothing).
  const formOpenedAt = body?.formOpenedAt
  if (typeof formOpenedAt === 'number' && formOpenedAt > 0) {
    const elapsed = Date.now() - formOpenedAt
    if (elapsed < MIN_FILL_MS) {
      console.warn(`[contact] fill-time too short ip=${ip} elapsed=${elapsed}ms`)
      // Silent fake-success — don't tip off the bot
      return { ok: true }
    }
    if (elapsed > MAX_FORM_AGE_MS) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Form expired. Please refresh the page and try again.',
      })
    }
  }

  // ── 8. Build email content ──────────────────────────────────────────
  const subject = `[Contact] ${name} — ${projectTypeLabel(projectType)}`

  const text = [
    `New contact form submission`,
    ``,
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Project type: ${projectTypeLabel(projectType)}`,
    ``,
    `Message:`,
    message,
    ``,
    `—`,
    `Submitted from uncdevelopment.com`,
    `IP: ${ip}`,
  ].join('\n')

  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:32px;background:#0A0A0F;color:#FAFAFA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#18181B;border:1px solid #27272A;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:28px 28px 8px;">
        <div style="font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#FF5C1F;margin-bottom:12px;">
          ● New contact inquiry
        </div>
        <h1 style="margin:0;font-size:24px;font-weight:500;letter-spacing:-0.02em;line-height:1.2;color:#FAFAFA;">
          ${escapeHtml(name)}
        </h1>
        <p style="margin:6px 0 0;font-size:14px;color:#A1A1AA;">
          ${escapeHtml(email)}
        </p>
      </td></tr>

      <tr><td style="padding:20px 28px;border-top:1px solid #27272A;">
        <div style="font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#71717A;margin-bottom:6px;">
          Project type
        </div>
        <div style="font-size:15px;color:#FAFAFA;">${escapeHtml(projectTypeLabel(projectType))}</div>
      </td></tr>

      <tr><td style="padding:20px 28px;border-top:1px solid #27272A;">
        <div style="font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#71717A;margin-bottom:8px;">
          Message
        </div>
        <div style="font-size:15px;line-height:1.6;color:#FAFAFA;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </td></tr>

      <tr><td style="padding:16px 28px 24px;border-top:1px solid #27272A;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.12em;color:#71717A;">
        Submitted from uncdevelopment.com · IP ${escapeHtml(ip)}
      </td></tr>
    </table>
  </body>
</html>`.trim()

  // ── 9. Send via Resend REST API ─────────────────────────────────────
  try {
    const result = await $fetch<{ id: string }>('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        html,
        text,
      },
    })

    return { ok: true, id: result.id }
  }
  catch (err: any) {
    console.error('[contact] Resend error:', err?.data ?? err)
    throw createError({
      statusCode: 502,
      statusMessage: "Couldn't send right now. Please try again or email directly.",
    })
  }
})
