import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App.tsx'

// Weather changes slowly: reuse fetched data for 10 minutes and retry a failed request once
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10 * 60 * 1000, retry: 1 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Skip motion animations for users who prefer reduced motion (CSS is handled in index.css) */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </QueryClientProvider>
  </StrictMode>,
)
