import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Moon,
  Snowflake,
  Sun,
  type LucideIcon,
} from 'lucide-react'

// "kind" drives the sky colors; the label and icon are for display
export type SkyKind = 'clear' | 'cloudy' | 'rain' | 'storm'

export interface WeatherInfo {
  label: string
  kind: SkyKind
  Icon: LucideIcon
}

// Translate an Open-Meteo WMO weather code (https://open-meteo.com/en/docs#weathervariables)
export function describeWeather(code: number, isDay = true): WeatherInfo {
  if (code === 0) return { label: 'ท้องฟ้าแจ่มใส', kind: 'clear', Icon: isDay ? Sun : Moon }
  if (code === 1 || code === 2) return { label: 'มีเมฆบางส่วน', kind: 'clear', Icon: isDay ? CloudSun : CloudMoon }
  if (code === 3) return { label: 'เมฆมาก', kind: 'cloudy', Icon: Cloud }
  if (code === 45 || code === 48) return { label: 'หมอก', kind: 'cloudy', Icon: CloudFog }
  if (code >= 51 && code <= 57) return { label: 'ฝนปรอย', kind: 'rain', Icon: CloudRain }
  if (code >= 61 && code <= 67) return { label: 'ฝนตก', kind: 'rain', Icon: CloudRain }
  if (code >= 71 && code <= 77) return { label: 'หิมะตก', kind: 'cloudy', Icon: Snowflake }
  if (code >= 80 && code <= 82) return { label: 'ฝนตกเป็นช่วง ๆ', kind: 'rain', Icon: CloudRain }
  if (code === 85 || code === 86) return { label: 'หิมะตกเป็นช่วง ๆ', kind: 'cloudy', Icon: Snowflake }
  if (code >= 95 && code <= 99) return { label: 'พายุฝนฟ้าคะนอง', kind: 'storm', Icon: CloudLightning }
  // Any code outside the documented WMO set
  return { label: 'ไม่ทราบสภาพอากาศ', kind: 'cloudy', Icon: Cloud }
}
