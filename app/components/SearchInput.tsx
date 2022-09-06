import type { ChangeEvent } from 'react'
import { alpha, Box } from '@mui/material'
import { useLocation, useNavigate } from '@remix-run/react'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import { useState, useEffect, useCallback } from 'react'

import theme from '~/mui/theme'
import type { BoxStyles } from '~/interfaces/types'
import { getSearchTerm } from '~/routes/__index/search'

const styles: BoxStyles = {
  search: {
    position: 'relative',
    [theme.breakpoints.only('xs')]: {
      width: '110px',
    },
    borderRadius: 25,
    backgroundColor: alpha(theme.palette.common.white, 0.95),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.99),
    },
    color: alpha(theme.palette.common.black, 0.8),
    marginLeft: 0,
  },
  searchIcon: {
    width: theme.spacing(5),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    color: 'inherit',
    padding: theme.spacing(1, 1, 1, 5),
  },
}

let timeoutId: NodeJS.Timeout

export default function SearchInput() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState(getSearchTerm())

  const updateSearchUrl = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const id = setTimeout(() => {
      navigate(`/search?query=${searchTerm}`)
    }, 200)

    timeoutId = id
  }, [navigate, searchTerm])

  useEffect(() => {
    if (location.pathname !== '/search') return

    updateSearchUrl()
  }, [location.pathname, searchTerm, updateSearchUrl])

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    setSearchTerm(text)
  }, [])

  return (
    <Box sx={styles.search}>
      <Box sx={styles.searchIcon}>
        <SearchIcon />
      </Box>
      <InputBase
        fullWidth
        placeholder="Search…"
        sx={styles.input}
        inputProps={{ 'aria-label': 'Search' }}
        onClick={() => {
          updateSearchUrl()
        }}
        onChange={handleChange}
        value={searchTerm}
      />
    </Box>
  )
}
