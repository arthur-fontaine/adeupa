import React, { useEffect, useState } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import User from './pages/User/User'
import Home from './pages/Home/Home'
import LocationContext, { LocationContextType } from './contexts/LocationContext'
import SessionActionsContext from './contexts/SessionActionsContext'
import ElementsLoadedContext from './contexts/ElementsLoadedContext'
import CharacterContext from './contexts/CharacterContext'
import getLocation from './utils/getLocation'
import registerSwipeEvent from './events/drag'
import Scanner from './pages/Scanner/Scanner'
import Personalization from './pages/Personalization/Personalization'
import Shop from './pages/Shop/Shop'
import { Shop as IShop } from './hooks/useShops'
import Search from './pages/Search/Search'
import Loading from './pages/Loading/Loading'
import useCharacter from './hooks/useCharacter'

function App() {
  const firstShopLoadedState = useState(false)
  const characterLoadedState = useState(false)

  return <ElementsLoadedContext.Provider value={{ firstShop: firstShopLoadedState, character: characterLoadedState }}>
    <AppContent />
  </ElementsLoadedContext.Provider>
}

function AppContent() {
  registerSwipeEvent()

  const isLoggedIn = localStorage.getItem('token') !== null
  const [location, setLocation] = useState<LocationContextType>()

  const sessionLikesState = useState<number[]>([])
  const sessionUnlikesState = useState<number[]>([])
  const cachedShopsState = useState<IShop[]>([])

  const character = useCharacter({ playing: false })

  const firstFetchLocation = async () => {
    try {
      const location = await getLocation({
        maximumAge: Infinity,
        timeout: 30000,
      })

      setLocation(location)
    } catch (error) {
      console.error(error)
      await firstFetchLocation()
    }
  }

  useEffect(() => {
    firstFetchLocation().then(() => {
      setInterval(async () => {
        const location = await getLocation({
          maximumAge: 0,
          timeout: 30000,
        })
        setLocation(location)
      }, 30000)
    })
  }, [])

  return (
    <CharacterContext.Provider value={character}>
      <LocationContext.Provider value={location}>
        <SessionActionsContext.Provider value={{
          sessionLikes: sessionLikesState,
          sessionUnlikes: sessionUnlikesState,
          cachedShops: cachedShopsState,
        }}>
          <div style={{ height: '100%' }}>
            <Loading />

            <BrowserRouter>
              <Routes>
                <Route path='/' element={isLoggedIn ? <div style={{ pointerEvents: 'none' }} /> : <Signup />} />

                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/scanner' element={<Scanner />} />
                <Route path='/search' element={<Search />} />
                <Route path='/user' element={<User />} />
                <Route path='/personalization' element={<Personalization />} />
                <Route path='/shops/:shopId' element={<Shop />} />

                {/*<Route path="/quests" element={<Quests />} />*/}
                <Route path='*' element={<div style={{ pointerEvents: 'none' }} />} />
              </Routes>
              <BackgroundRoute>{isLoggedIn && <Home />}</BackgroundRoute>
            </BrowserRouter>
          </div>
        </SessionActionsContext.Provider>
      </LocationContext.Provider>
    </CharacterContext.Provider>
  )
}

function BackgroundRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div style={{
      height: '100%',
      position: 'relative',
      display: ['/', '/home'].includes(location.pathname) ? 'block' : 'none',
    }}>
      {children}
    </div>
  )
}

export default App
