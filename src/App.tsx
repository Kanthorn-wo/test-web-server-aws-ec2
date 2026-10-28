import { useState } from 'react'
import { motion } from 'motion/react'
import type { City } from './features/weather/api'
import { useWeather } from './features/weather/useWeather'
import { describeWeather } from './features/weather/weatherCode'
import { Sky } from './features/weather/Sky'
import { SearchBar } from './features/weather/SearchBar'
import { CurrentWeather } from './features/weather/CurrentWeather'
import { HourlyChart } from './features/weather/HourlyChart'
import { DailyForecast } from './features/weather/DailyForecast'
import './App.css'

// Shown on first load, before the user picks a city
const DEFAULT_CITY: City = {
  name: 'กรุงเทพมหานคร',
  region: '',
  country: 'ไทย',
  latitude: 13.75398,
  longitude: 100.50144,
}

function App() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY)
  const { data, isError, refetch } = useWeather(selectedCity)

  // Before data exists, fall back to a clear day sky
  const current = data?.forecast.current
  const isDay = current ? current.is_day === 1 : true
  const { kind } = current ? describeWeather(current.weather_code, isDay) : { kind: 'clear' as const }

  return (
    <main className="app" data-sky={`${kind}-${isDay ? 'day' : 'night'}`}>
      <Sky kind={kind} isDay={isDay} />

      <header className="app__header">
        <span className="app__title">พยากรณ์อากาศ</span>
        <SearchBar onSelect={setSelectedCity} />
      </header>

      {isError && (
        <div className="app__message" role="alert">
          <p>โหลดข้อมูลไม่สำเร็จ</p>
          <button className="app__retry" type="button" onClick={() => refetch()}>
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}
      {!data && !isError && (
        <p className="app__message app__message--loading" role="status">
          กำลังโหลดข้อมูล...
        </p>
      )}

      {/* Keyed by city so a new city cross-fades in */}
      {data && !isError && (
        <motion.div
          key={`${data.city.latitude},${data.city.longitude}`}
          className="app__content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="app__hero">
            <CurrentWeather city={data.city} current={data.forecast.current} />
          </div>
          <div className="app__details">
            <HourlyChart hourly={data.forecast.hourly} currentTime={data.forecast.current.time} />
            <DailyForecast daily={data.forecast.daily} />
          </div>
        </motion.div>
      )}
    </main>
  )
}

export default App
