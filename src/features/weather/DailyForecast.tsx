import { motion } from 'motion/react'
import type { Forecast } from './api'
import { describeWeather } from './weatherCode'
import './DailyForecast.css'

export function DailyForecast({ daily }: { daily: Forecast['daily'] }) {
  const weekMin = Math.min(...daily.temperature_2m_min)
  const weekMax = Math.max(...daily.temperature_2m_max)
  const weekSpan = weekMax - weekMin || 1

  return (
    <section className="daily">
      <h2 className="daily-heading">7 วันข้างหน้า</h2>
      <ol className="daily-list">
        {daily.time.map((date, i) => {
          const { label, Icon } = describeWeather(daily.weather_code[i], true)
          const min = daily.temperature_2m_min[i]
          const max = daily.temperature_2m_max[i]
          const rain = daily.precipitation_probability_max[i]
          const weekday = i === 0 ? 'วันนี้' : new Date(date).toLocaleDateString('th-TH', { weekday: 'short' })

          return (
            <motion.li
              key={date}
              className="daily-row"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="daily-weekday">{weekday}</span>
              <span className="daily-condition">
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                <span className="daily-label">{label}</span>
              </span>
              <span className={rain === 0 ? 'daily-rain daily-rain-none' : 'daily-rain'}>ฝน {rain}%</span>
              <span className="daily-temp">{Math.round(min)}°</span>
              <span className="daily-range" aria-hidden="true">
                <span
                  className="daily-range-fill"
                  style={{
                    left: `${((min - weekMin) / weekSpan) * 100}%`,
                    width: `${((max - min) / weekSpan) * 100}%`,
                  }}
                />
              </span>
              <span className="daily-temp">{Math.round(max)}°</span>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
