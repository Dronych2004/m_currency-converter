import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, mkdirSync, copyFileSync } from 'fs'
import { generateSeoRoutes } from './seo-routes.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = resolve(__dirname, '../dist')

// Динамическая генерация всех маршрутов
const routes = ['/', ...generateSeoRoutes()]

console.log(`Total routes to prerender: ${routes.length}`)

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
      if (route === '/') {
        // Root route: overwrite dist/index.html with prerendered version
        const outputPath = resolve(distDir, 'index.html')
        writeFileSync(outputPath, rendered.html)
        console.log(`  Written: /index.html (prerendered)`)
      } else {
        // Other routes: write to /route/index.html
        const dirPath = resolve(distDir, `.${route}`)
        const outputPath = resolve(dirPath, 'index.html')
        mkdirSync(dirPath, { recursive: true })
        writeFileSync(outputPath, rendered.html)
        console.log(`  Written: ${route}/index.html`)
      }
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
