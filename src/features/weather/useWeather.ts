import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchForecast, searchCity, type City } from './api'

// Look up the city by name, then load its forecast
export function useWeather(cityName: string) {
  const cityQuery = useQuery({
    queryKey: ['city', cityName],
    queryFn: () => searchCity(cityName),
  })
  const city = cityQuery.data

  const forecastQuery = useQuery({
    queryKey: ['forecast', city?.latitude, city?.longitude],
    queryFn: () => fetchForecast(city as City),
    enabled: !!city,
    // Keep showing the old city while the new one loads, so the UI can cross-fade
    placeholderData: keepPreviousData,
  })
  const forecast = forecastQuery.data

  const isNotFound = city === null
  const isError = cityQuery.isError || forecastQuery.isError
  const isLoading = !forecast && !isNotFound && !isError

  return { city, forecast, isLoading, isNotFound, isError }
}
