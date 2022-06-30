import './Search.scss'
import CardSearch from '../../components/CardSearch/CardSearch'
import NavBar from '../../components/NavBar/NavBar'
import axiosInstance from '../../utils/axiosInstance'
import React, { ReactElement, useDeferredValue, useEffect, useMemo, useState } from 'react'

function Search() {
  const initialValues = {
    query: '',
  }

  const [query, setQuery] = useState(initialValues.query)
  const [results, setResults] = useState<ReactElement[]>([])
  const deferredQuery = useDeferredValue(query)

  const fetchResults = async (query: string) => {
    const response = await axiosInstance.get<{
      id: number
      image: string
      name: string
      location: {
        id: number
        name: string
        longitude: number
        latitude: number
      }
    }[]>(`/search?query=${query}&include=image`)
    return response.data
  }

  useMemo(async () => {
      if (deferredQuery.length > 0) {
        const results = await fetchResults(deferredQuery)
        setResults(results.map((result) => <CardSearch key={result.id} title={result.name} image={result.image}
                                                       address={result.location.name} />))
      }
    }, [deferredQuery, setResults],
  ).then()

  return (
    <div className='search-page'>
      <div>
        <div className='search-page__card'>
          <h3 className='search-page__card--title'>Que voulez vous rechercher ?</h3>
          <div className='search-page__card--search'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
              <path fill='none' d='M0 0h24v24H0z' />
              <path
                d='M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z'
                fill='#8d8c94' />
            </svg>
            <input className='search-page__card--search--input' placeholder='Rechercher' type='text'
                   onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        {query.length > 0 && <h2 className='search-page__title'>Recherche récentes</h2>}

        {query.length > 0 && <div className='search-page__results'>
          {results}
        </div>}
      </div>

      <NavBar />
    </div>
  )
}

export default Search
