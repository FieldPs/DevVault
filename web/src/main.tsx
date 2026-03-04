import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import './index.css'
import App from './App.tsx'

// Force dark mode on the HTML element so HeroUI + Tailwind dark: variants both work
document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* className="dark" activates HeroUI's dark theme token set */}
      <HeroUIProvider className="dark">
        <App />
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>,
)
