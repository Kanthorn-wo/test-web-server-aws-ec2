// Open-Meteo client (no API key needed). Docs: https://open-meteo.com/en/docs

export interface City {
  name: string
  // Province or state, used to tell apart cities with the same name
  region: string
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
  // Open-Meteo returns null for values it does not have (rain probability is missing in some regions)
  hourly: {
    time: string[]
    temperature_2m: (number | null)[]
    precipitation_probability: (number | null)[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: (number | null)[]
    temperature_2m_min: (number | null)[]
    precipitation_probability_max: (number | null)[]
  }
}

// Up to 5 cities matching the typed name (empty array when nothing matches)
export async function searchCities(name: string): Promise<City[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=th`
  const response = await fetch(url)
  if (!response.ok) throw new Error('geocoding request failed')

  const data = await response.json()
  const matches: Record<string, string | number>[] = data.results ?? []

  return matches.map((match) => ({
    name: String(match.name),
    region: String(match.admin1 ?? ''),
    country: String(match.country ?? ''),
    latitude: Number(match.latitude),
    longitude: Number(match.longitude),
  }))
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
