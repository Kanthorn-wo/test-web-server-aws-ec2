import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import './SearchBar.css'

interface SearchBarProps {
  onSearch: (name: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [text, setText] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const name = text.trim()
    if (name) onSearch(name)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-bar__label" htmlFor="city-search">
        ค้นหาเมือง
      </label>
      <input
        id="city-search"
        className="search-bar__input"
        type="search"
        placeholder="ค้นหาเมือง"
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoComplete="off"
      />
      <button className="search-bar__button" type="submit" aria-label="ค้นหา">
        <Search size={18} strokeWidth={1.5} />
      </button>
    </form>
  )
}
