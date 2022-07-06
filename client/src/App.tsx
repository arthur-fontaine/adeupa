import React, { useEffect, useState } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import User from './pages/User/User'
import Home from './pages/Home/Home'
import LocationContext, { LocationContextType } from './contexts/LocationContext'
import SessionActionsContext from './contexts/SessionActionsContext'
import getLocation from './utils/getLocation'
import registerSwipeEvent from './events/drag'
import Scanner from './pages/Scanner/Scanner'
import Personalization from './pages/Personalization/Personalization'
import Shop from './pages/Shop/Shop'
import Search from './pages/Search/Search'

function App() {
  registerSwipeEvent()

  const isLoggedIn = localStorage.getItem('token') !== null
  const [location, setLocation] = useState<LocationContextType>()

  const sessionLikesState = useState<number[]>([])
  const sessionUnlikesState = useState<number[]>([])

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
    <LocationContext.Provider value={location}>
      <SessionActionsContext.Provider value={{
        sessionLikes: sessionLikesState,
        sessionUnlikes: sessionUnlikesState,
      }}>
        <div style={{ height: '100%' }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={isLoggedIn ? <Home /> : <Signup />} />

              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/scanner' element={<Scanner />} />
              <Route path='/search' element={<Search />} />
              <Route path='/user' element={<User />} />
              <Route path='/personalization' element={<Personalization />} />
              <Route path='/shops/:shopId' element={<Shop />} />

              {/*<Route path="/quests" element={<Quests />} />*/}
              <Route path='*' element={<Home />} />
            </Routes>
          </BrowserRouter>
        </div>
      </SessionActionsContext.Provider>
    </LocationContext.Provider>
  )
}

export default App
