import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { generateSeoRoutes } from './seo-routes.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const hostname = 'https://cconverter.ru'
const today = new Date().toISOString().split('T')[0]

// Топ-пары с рукописным контентом — приоритет 0.9
const MANUAL_ROUTES = new Set([
  '/usd-rub', '/eur-rub', '/eur-usd', '/btc-usd',
  '/usd-kzt', '/usd-uah', '/usd-cny',
  '/rub-byn', '/rub-kzt', '/rub-try', '/rub-egp',
])

function urlEntry(loc, changefreq, priority, alternate = true) {
  let xml = `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`

  if (alternate) {
    xml += `
    <xhtml:link rel="alternate" hreflang="ru" href="${loc}?lang=ru" />
    <xhtml:link rel="alternate" hreflang="en" href="${loc}?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`
  }

  xml += `
  </url>`
  return xml
}

const routes = generateSeoRoutes()

const entries = []

// Главная
entries.push(urlEntry(`${hostname}/`, 'daily', 1.0))

// SEO-страницы
for (const route of routes) {
  const priority = MANUAL_ROUTES.has(route) ? 0.9 : 0.8
  entries.push(urlEntry(`${hostname}${route}`, 'weekly', priority))
}

// Статические страницы
entries.push(urlEntry(`${hostname}/privacy.html`, 'monthly', 0.3, false))
entries.push(urlEntry(`${hostname}/terms.html`, 'monthly', 0.3, false))

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`

const outputPath = resolve(__dirname, '../dist/sitemap.xml')
writeFileSync(outputPath, sitemap)
console.log(`Sitemap generated: ${entries.length} URLs`)
