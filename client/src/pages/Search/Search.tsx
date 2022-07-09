import './Search.scss'
import CardSearch from '../../components/CardSearch/CardSearch'
import NavBar from '../../components/NavBar/NavBar'
import axiosInstance from '../../utils/axiosInstance'
import React, { useDeferredValue, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TextInput from '../../components/TextInput/TextInput'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const deferredQuery = useDeferredValue(query)
  const [results, setResults] = useState<{ id: number, name: string, image: string, location: { name: string } }[]>([])
  const [history, setHistory] = useState<{ id: number, name: string, image: string, location: { name: string } }[]>([])

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

  const fetchHistory = async () => {
    const response = await axiosInstance.get<{
      shop: {
        id: number
        image: string
        name: string
        location: {
          id: number
          name: string
          longitude: number
          latitude: number
        }
      }
    }[]>(`/users/me/search-history`)
    return response.data.map(({ shop }) => shop)
  }

  const addToHistory = async (shop: { id: number }) => {
    await axiosInstance.put(`/users/me/search-history?shopId=${shop.id}`)
  }

  useEffect(() => {
    fetchHistory().then(setHistory)
  }, [])

  useEffect(() => {
    if (deferredQuery && deferredQuery.length > 0) {
      setSearchParams({ query: deferredQuery })
      fetchResults(deferredQuery).then(setResults)
    }

    if (deferredQuery.length === 0) {
      setSearchParams({})
      setResults([])
    }
  }, [deferredQuery])

  return (
    <div className='search-page'>
      <div>
        <div>
          <TextInput name='search' type='text' placeholder='Rechercher' value={query} icon='search'
                     onChange={(e) => setQuery(e.target.value)} />
        </div>

        {query.length === 0 && history.length > 0 && (
          <div className='search-page__history'>
            <h2 className='search-page__title'>Historique</h2>
            <div className='search-page__history-list'>
              {history.reduce((acc, shop) => {
                if (acc.find(({ id }) => id === shop.id)) {
                  return acc
                }

                return [...acc, shop]
              }, [] as { id: number, name: string, image: string, location: { name: string } }[]).map((shop) => (
                <CardSearch key={shop.id} image={shop.image} title={shop.name} address={shop.location.name} id={shop.id}
                            onClick={() => addToHistory(shop)}/>
              ))}
            </div>
          </div>
        )}

        {query.length > 0 && results.length > 0 && <h2 className='search-page__title'>Résultats</h2>}

        {query.length > 0 && <div className='search-page__results'>
          {results.map((result) => <CardSearch key={result.id} id={result.id} title={result.name} image={result.image}
                                               address={result.location.name} onClick={() => addToHistory(result)} />)}
        </div>}

        {query.length > 0 && results.length === 0 && <h2 className='search-page__title'>Aucun résultat</h2>}
      </div>

      <NavBar />
    </div>
  )
}

export default Search
