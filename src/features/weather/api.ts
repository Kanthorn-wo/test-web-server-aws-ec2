// Open-Meteo client (no API key needed). Docs: https://open-meteo.com/en/docs

export interface City {
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface Forecast {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
    is_day: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
  }
}

// Returns null when no city matches the name
export async function searchCity(name: string): Promise<City | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=th`
  const response = await fetch(url)
  if (!response.ok) throw new Error('geocoding request failed')

  const data = await response.json()
  const match = data.results?.[0]
  if (!match) return null

  return {
    name: match.name,
    country: match.country ?? '',
    latitude: match.latitude,
    longitude: match.longitude,
  }
}

export async function fetchForecast(city: City): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    timezone: 'auto',
    forecast_days: '7',
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!response.ok) throw new Error('forecast request failed')

  return response.json()
}
