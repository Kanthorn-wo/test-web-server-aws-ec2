import { Droplets, Wind } from 'lucide-react'
import { motion } from 'motion/react'
import type { City, Forecast } from './api'
import { describeWeather } from './weatherCode'
import './CurrentWeather.css'

interface CurrentWeatherProps {
  city: City
  current: Forecast['current']
}

// Gentle staggered entrance: each child rises and fades in slightly after the previous one
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
}

export function CurrentWeather({ city, current }: CurrentWeatherProps) {
  const { label, Icon } = describeWeather(current.weather_code, current.is_day === 1)

  return (
    <motion.section
      className="current-weather"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.12 }}
    >
      <motion.h1 className="current-weather__city" variants={rise}>
        {city.name}
        {city.country && <span className="current-weather__country">{city.country}</span>}
      </motion.h1>

      <motion.p className="current-weather__label" variants={rise}>
        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
        {label}
      </motion.p>

      <motion.p className="current-weather__temp" variants={rise}>
        {Math.round(current.temperature_2m)}
        <span className="current-weather__degree">°</span>
      </motion.p>

      <motion.p className="current-weather__feels" variants={rise}>
        รู้สึกเหมือน {Math.round(current.apparent_temperature)}°
      </motion.p>

      <motion.dl className="current-weather__facts" variants={rise}>
        <div className="current-weather__fact">
          <dt>
            <Droplets size={16} strokeWidth={1.5} aria-hidden="true" />
            ความชื้น
          </dt>
          <dd>{current.relative_humidity_2m}%</dd>
        </div>
        <div className="current-weather__fact">
          <dt>
            <Wind size={16} strokeWidth={1.5} aria-hidden="true" />
            ลม
          </dt>
          <dd>{Math.round(current.wind_speed_10m)} km/h</dd>
        </div>
      </motion.dl>
    </motion.section>
  )
}
