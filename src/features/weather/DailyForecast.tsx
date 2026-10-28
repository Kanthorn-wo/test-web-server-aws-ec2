import { motion } from 'motion/react'
import type { Forecast } from './api'
import { describeWeather } from './weatherCode'
import './DailyForecast.css'

// Index matches Date.getUTCDay() (0 is Sunday)
const WEEKDAYS_TH = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']

const isNumber = (value: number | null): value is number => value !== null

export function DailyForecast({ daily }: { daily: Forecast['daily'] }) {
  const weekMin = Math.min(...daily.temperature_2m_min.filter(isNumber))
  const weekMax = Math.max(...daily.temperature_2m_max.filter(isNumber))
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
          // Dates are already local to the city, so read the weekday from the date itself (UTC),
          // not from the viewer's timezone, which could shift it by one day
          const weekday = i === 0 ? 'วันนี้' : WEEKDAYS_TH[new Date(`${date}T00:00:00Z`).getUTCDay()]

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
              <span className="daily-rain">ฝน {rain === null ? '-' : `${rain}%`}</span>
              <span className="daily-temp">{min === null ? '-' : `${Math.round(min)}°`}</span>
              <span className="daily-range" aria-hidden="true">
                {min !== null && max !== null && (
                  <span
                    className="daily-range-fill"
                    style={{
                      left: `${((min - weekMin) / weekSpan) * 100}%`,
                      width: `${((max - min) / weekSpan) * 100}%`,
                    }}
                  />
                )}
              </span>
              <span className="daily-temp">{max === null ? '-' : `${Math.round(max)}°`}</span>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
