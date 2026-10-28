import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { searchCities, type City } from './api'
import './SearchBar.css'

interface SearchBarProps {
  onSelect: (city: City) => void
}

const DEBOUNCE_MS = 250
const MIN_QUERY_LENGTH = 2

export function SearchBar({ onSelect }: SearchBarProps) {
  const [text, setText] = useState('')
  // Debounced copy of `text`: the suggestion request waits until the user pauses typing
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceTimer = useRef<number | undefined>(undefined)

  const trimmedText = text.trim()
  const trimmedQuery = query.trim()
  const { data: cities = [], isFetching, isError } = useQuery({
    queryKey: ['cities', trimmedQuery],
    queryFn: () => searchCities(trimmedQuery),
    enabled: trimmedQuery.length >= MIN_QUERY_LENGTH,
  })

  const isShowingDropdown = isOpen && trimmedText.length >= MIN_QUERY_LENGTH
  // True while the list on screen does not belong to the text in the input yet
  const isWaiting = trimmedText !== trimmedQuery || isFetching
  const hasOptions = !isWaiting && cities.length > 0

  function handleChange(value: string) {
    setText(value)
    setIsOpen(true)
    setActiveIndex(-1)
    window.clearTimeout(debounceTimer.current)
    debounceTimer.current = window.setTimeout(() => setQuery(value), DEBOUNCE_MS)
  }

  function selectCity(city: City) {
    window.clearTimeout(debounceTimer.current)
    setText(city.name)
    setIsOpen(false)
    setActiveIndex(-1)
    onSelect(city)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      setIsOpen(false)
    } else if (event.key === 'ArrowDown' && hasOptions) {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex(Math.min(activeIndex + 1, cities.length - 1))
    } else if (event.key === 'ArrowUp' && hasOptions) {
      event.preventDefault()
      setActiveIndex(Math.max(activeIndex - 1, 0))
    }
  }

  // Enter (or the search button) picks the highlighted suggestion, or the first one
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isShowingDropdown || !hasOptions) return
    selectCity(cities[Math.max(activeIndex, 0)])
  }

  function describeStatus() {
    if (isWaiting) return 'กำลังค้นหา...'
    if (isError) return 'ค้นหาไม่สำเร็จ ลองใหม่อีกครั้ง'
    return 'ไม่พบเมืองที่ค้นหา'
  }

  return (
    <div className="search-bar">
      <form className="search-bar__field" onSubmit={handleSubmit} role="search">
        <label className="search-bar__label" htmlFor="city-search">
          ค้นหาเมือง
        </label>
        <input
          id="city-search"
          className="search-bar__input"
          type="search"
          placeholder="ค้นหาเมือง"
          value={text}
          maxLength={100}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isShowingDropdown && hasOptions}
          aria-controls="city-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `city-option-${activeIndex}` : undefined}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        />
        <button className="search-bar__button" type="submit" aria-label="ค้นหา">
          <Search size={18} strokeWidth={1.5} />
        </button>
      </form>

      {isShowingDropdown && (
        <div className="search-bar__dropdown">
          {hasOptions ? (
            <ul id="city-suggestions" role="listbox" aria-label="เมืองที่แนะนำ">
              {cities.map((city, index) => (
                <li
                  key={`${city.latitude},${city.longitude}`}
                  id={`city-option-${index}`}
                  className="search-bar__option"
                  role="option"
                  aria-selected={index === activeIndex}
                  // Keep focus in the input so onBlur does not close the list before the click lands
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCity(city)}
                >
                  <span className="search-bar__city">{city.name}</span>
                  <span className="search-bar__place">
                    {[city.region, city.country].filter(Boolean).join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search-bar__status" role="status">
              {describeStatus()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
