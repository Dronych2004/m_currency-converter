import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, mkdirSync, copyFileSync } from 'fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = resolve(__dirname, '../dist')

// Все маршруты для prerendering
const routes = [
  '/',
  '/usd-rub',
  '/eur-rub',
  '/eur-usd',
  '/btc-usd',
  '/usd-kzt',
  '/usd-uah',
  '/usd-cny',
  '/rub-byn',
  '/rub-kzt',
  '/rub-try',
  '/rub-egp',
]

async function prerender() {
  const Prerenderer = (await import('@prerenderer/prerenderer')).default
  const PuppeteerRenderer = (await import('@prerenderer/renderer-puppeteer')).default

  const prerenderer = new Prerenderer({
    staticDir: distDir,
    renderer: new PuppeteerRenderer({
      renderAfterDocumentEvent: 'custom-render-trigger',
      maxConcurrentRoutes: 4,
      headless: true,
      skipThirdPartyRequests: true,
    }),
  })

  try {
    console.log('Starting prerender...')
    await prerenderer.initialize()
    console.log('Prerenderer initialized, rendering routes...')

    const renderedRoutes = await prerenderer.renderRoutes(routes)

    // Write rendered HTML to files
    for (const rendered of renderedRoutes) {
      const route = rendered.route
      // For root route, write to index.html (already exists, skip)
      if (route === '/') {
        console.log(`  Skipped: / (already index.html)`)
        continue
      }
      // For other routes, write to /route/index.html
      const dirPath = resolve(distDir, `.${route}`)
      const outputPath = resolve(dirPath, 'index.html')
      mkdirSync(dirPath, { recursive: true })
      writeFileSync(outputPath, rendered.html)
      console.log(`  Written: ${route}/index.html`)
    }

    // Copy .htaccess to dist
    const htaccessSrc = resolve(__dirname, '../public/.htaccess')
    const htaccessDest = resolve(distDir, '.htaccess')
    try {
      copyFileSync(htaccessSrc, htaccessDest)
      console.log('Copied .htaccess to dist/')
    } catch (e) {
      console.log('No .htaccess to copy')
    }

    console.log(`\nSuccessfully prerendered ${renderedRoutes.length} routes`)

    await prerenderer.destroy()
    console.log('Prerender complete!')
  } catch (error) {
    console.error('Prerender failed:', error)
    await prerenderer.destroy()
    process.exit(1)
  }
}

prerender()
