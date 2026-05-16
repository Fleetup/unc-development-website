import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler((event) => {
  const filePath = resolve(process.cwd(), 'public/frames/Laptop.svg')
  let svg = readFileSync(filePath, 'utf-8')

  // The laptop screen polygon uses class="st77".
  // CSS rule: .st75, .st76, .st77 { fill: #fff; }
  // Split the combined rule: keep st75/st76 fills, override st77 to none
  // so slot content positioned behind the SVG is visible.
  svg = svg.replace(
    /(\.st75,\s*\.st76,\s*\.st77\s*\{[^}]*?fill:\s*)(#[a-fA-F0-9]+|[a-z]+)([^}]*?\})/s,
    '.st75, .st76 { fill: $2$3\n      .st77 { fill: none; }',
  )

  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')
  return svg
})
