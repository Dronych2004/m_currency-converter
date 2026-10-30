import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'

export function render(path: string) {
  let body = renderToString(<HelmetProvider><LanguageProvider><App prerenderPath={path} /></LanguageProvider></HelmetProvider>)
  const tags: string[] = []
  // React 19 emits metadata directly instead of filling Helmet's context.
  body = body.replace(/<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>/g, tag => {
    tags.push(tag.replace(/^<(title|meta|link)\b/, '<$1 data-prerender="true"'))
    return ''
  })
  return { body, head: tags.join('') }
}
