import { resolve } from 'node:path'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import { generateSeoRoutes } from './seo-routes.mjs'

// Render static HTML without a browser, third-party scripts or live API calls.
const root = fileURLToPath(new URL('../', import.meta.url))
const dist = resolve(root, 'dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
// Use a production SSR bundle, not the dev module runner, for build-time HTML.
const serverOutput = resolve(root, 'work/prerender-ssr')
await build({
  root,
  configFile: false,
  build: { ssr: 'src/entry-prerender.tsx', outDir: serverOutput },
})
const { render } = await import(pathToFileURL(resolve(serverOutput, 'entry-prerender.js')).href)
const routes = ['/', '/pairs/', ...generateSeoRoutes()]
for (const route of routes) {
  const { body, head } = render(route)
  const html = template.replace(/<title>[\s\S]*?<\/title>/, '').replace('</head>', `${head}</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)]
  if (canonicals.length !== 1 || !canonicals[0][0].includes(`https://cconverter.ru${route}`)) throw new Error(`Invalid canonical: ${route}`)
  const output = route === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${route}`, 'index.html')
  mkdirSync(resolve(output, '..'), { recursive: true })
  writeFileSync(output, html)
}
console.log(`Prerender complete: ${routes.length} pages; one canonical per page.`)
