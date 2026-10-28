import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchForecast, type City } from './api'

// Load the forecast for a city.
// The city travels together with its forecast, so the UI never shows one city's name
// next to another city's data while a new city is loading
export function useWeather(city: City) {
  return useQuery({
    queryKey: ['forecast', city.latitude, city.longitude],
    queryFn: async () => ({ city, forecast: await fetchForecast(city) }),
    // Keep the previous city on screen until the new one arrives
    placeholderData: keepPreviousData,
  })
}
