import { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Search({ onSearch, placeholder = 'Search Products' }) {
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (onSearch) 
    onSearch(value)
  }

  return (
    <TextField
    value={query}
    onChange={handleChange}
    placeholder={placeholder}
    size="small"
    className="w-full max-w-xs"
    slotProps={{
    input: {startAdornment: (
        <InputAdornment position="start">
            <SearchIcon fontSize="small" />
        </InputAdornment>
        )}
    }}
    />
  )
}

export default Search