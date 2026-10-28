import { useState } from 'react'
import { motion } from 'motion/react'
import { useWeather } from './features/weather/useWeather'
import { describeWeather } from './features/weather/weatherCode'
import { Sky } from './features/weather/Sky'
import { SearchBar } from './features/weather/SearchBar'
import { CurrentWeather } from './features/weather/CurrentWeather'
import { HourlyChart } from './features/weather/HourlyChart'
import { DailyForecast } from './features/weather/DailyForecast'
import './App.css'

function App() {
  const [cityName, setCityName] = useState('Bangkok')
  const { city, forecast, isNotFound, isError } = useWeather(cityName)

  // Before data exists, fall back to a clear day sky
  const current = forecast?.current
  const isDay = current ? current.is_day === 1 : true
  const { kind } = current ? describeWeather(current.weather_code, isDay) : { kind: 'clear' as const }

  return (
    <main className="app" data-sky={`${kind}-${isDay ? 'day' : 'night'}`}>
      <Sky kind={kind} isDay={isDay} />

      <header className="app__header">
        <span className="app__title">พยากรณ์อากาศ</span>
        <SearchBar onSearch={setCityName} />
      </header>

      {isNotFound && <p className="app__message">ไม่พบเมืองที่ค้นหา ลองพิมพ์ชื่ออื่น</p>}
      {isError && <p className="app__message">โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
      {!isNotFound && !isError && !(city && forecast) && (
        <p className="app__message app__message--loading">กำลังโหลดข้อมูล...</p>
      )}

      {/* Keyed by city so a new city cross-fades in */}
      {city && forecast && !isNotFound && !isError && (
        <motion.div
          key={city.name}
          className="app__content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="app__hero">
            <CurrentWeather city={city} current={forecast.current} />
          </div>
          <div className="app__details">
            <HourlyChart hourly={forecast.hourly} currentTime={forecast.current.time} />
            <DailyForecast daily={forecast.daily} />
          </div>
        </motion.div>
      )}
    </main>
  )
}

export default App
