import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler((event) => {
  const filePath = resolve(process.cwd(), 'public/frames/Phone.svg')
  let svg = readFileSync(filePath, 'utf-8')

  // The phone screen uses class="st66".
  // CSS rule: .st65, .st66 { fill: #fff; }
  // Split the combined rule: keep st65 fill, override st66 to none
  // so slot content positioned behind the SVG is visible.
  svg = svg.replace(
    /(\.st65,\s*\.st66\s*\{[^}]*?fill:\s*)(#[a-fA-F0-9]+|[a-z]+)([^}]*?\})/s,
    '.st65 { fill: $2$3\n      .st66 { fill: none; }',
  )

  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')
  return svg
})
