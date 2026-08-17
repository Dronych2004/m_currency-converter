import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EmbedWidget } from './components/EmbedWidget'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmbedWidget />
  </StrictMode>,
)
