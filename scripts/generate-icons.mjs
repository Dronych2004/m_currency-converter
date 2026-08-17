// Скрипт генерации PWA-иконок
// Запуск: node scripts/generate-icons.mjs

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const sizes = [192, 512]
const publicDir = join(process.cwd(), 'public')
const iconsDir = join(publicDir, 'icons')

if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true })
}

function createIconSvg(size) {
  const fontSize = size * 0.5

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <text x="${size / 2}" y="${size / 2 + fontSize * 0.35}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">💱</text>
</svg>`
}

for (const size of sizes) {
  const svg = createIconSvg(size)
  const svgPath = join(iconsDir, `icon-${size}.svg`)
  writeFileSync(svgPath, svg)
  console.log(`Created: icons/icon-${size}.svg`)
}

const maskableSvg = createIconSvg(512)
const maskablePath = join(iconsDir, 'icon-maskable-512.svg')
writeFileSync(maskablePath, maskableSvg)
console.log('Created: icons/icon-maskable-512.svg')
