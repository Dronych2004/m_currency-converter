import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import vm from 'node:vm'
import { generateSeoRoutes } from './seo-routes.mjs'

const routes = ['/', '/pairs/', ...generateSeoRoutes()]
for (const route of routes) {
  const html = readFileSync(`dist${route}index.html`, 'utf8')
  const head = html.split('</head>')[0]
  assert.equal((head.match(/rel="canonical"/g) || []).length, 1, route)
  assert.ok(head.includes(`href="https://cconverter.ru${route}"`), route)
  for (const pattern of [/<title\b/g, /name="description"/g, /property="og:description"/g]) assert.equal((head.match(pattern) || []).length, 1, `${route}: ${pattern}`)
  assert.equal((html.match(/<h1\b/g) || []).length, 1, route)
  assert.ok(html.includes('/analytics.js'))
  assert.ok(!html.includes('datePublished'))
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    .replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&amp;', '&')
  for (const [, json] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(json)
    if (schema['@type'] !== 'FAQPage') continue
    for (const item of schema.mainEntity) {
      assert.ok(visible.includes(item.name), `${route}: invisible FAQ question`)
      assert.ok(visible.includes(item.acceptedAnswer.text), `${route}: invisible FAQ answer`)
    }
  }
  for (const [, link] of html.matchAll(/href="(\/[a-z]{3}-[a-z]{3})"/g)) assert.fail(`Noncanonical link: ${route}: ${link}`)
}
const sitemap=readFileSync('dist/sitemap.xml','utf8')
// Every pair must be discoverable from the home page through ordinary HTML links.
const directory = readFileSync('dist/pairs/index.html', 'utf8')
assert.ok(readFileSync('dist/index.html', 'utf8').includes('href="/pairs/"'))
for (const route of generateSeoRoutes()) {
  assert.ok(directory.includes(`href="${route}"`), `Directory misses ${route}`)
  assert.ok(readFileSync(`dist${route}index.html`, 'utf8').includes('href="/pairs/"'), route)
}
for(const [,loc] of sitemap.matchAll(/<loc>https:\/\/cconverter.ru([^<]*)<\/loc>/g)) assert.ok(existsSync(`dist${loc.endsWith('/') ? loc+'index.html' : loc}`), loc)
assert.match(readFileSync('dist/404.html','utf8'),/noindex/)
const code=readFileSync('public/analytics.js','utf8')
for(const [hostname,webdriver,count] of [['cconverter.ru',false,1],['localhost',false,0],['cconverter.ru',true,0]]) {
  const scripts=[]; const win={};vm.runInNewContext(code,{navigator:{webdriver},location:{hostname},window:win,Date,document:{createElement:()=>({}),head:{appendChild:x=>scripts.push(x)}},ym:(...args)=>{win.calls=(win.calls||[]).concat([args])}})
  assert.equal(scripts.length,count)
  if(count) {assert.equal(win.calls[0][1],'init');assert.equal(win.calls[0][2].defer,true);assert.equal(typeof win.ym,'function')}
}
console.log(`PASS: ${routes.length} pages, metadata, canonical links, sitemap files, 404 document, analytics bootstrap.`)
