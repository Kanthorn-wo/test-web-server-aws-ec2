import type { SkyKind } from './weatherCode'
import './Sky.css'

interface SkyProps {
  kind: SkyKind
  isDay: boolean
}

// Fixed full-screen background. Gradient colors come from the data-sky palette in Sky.css;
// the atmosphere (glow, stars, rain) is a CSS-only pseudo element chosen by these data attributes
export function Sky({ kind, isDay }: SkyProps) {
  return <div className="sky" data-kind={kind} data-time={isDay ? 'day' : 'night'} aria-hidden="true" />
}
