import React, { useEffect, useState } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import User from './pages/User/User'
import Home from './pages/Home/Home'
import LocationContext, { LocationContextType } from './contexts/LocationContext'
import getLocation from './utils/getLocation'
import registerSwipeEvent from './events/drag'
import Scanner from './pages/Scanner/Scanner'
import Personalization from './pages/Personalization/Personalization'

function App() {
  registerSwipeEvent()

  const isLoggedIn = localStorage.getItem('token') !== null
  const [location, setLocation] = useState<LocationContextType>()

  useEffect(() => {
    getLocation().then(location => {
      setLocation(location)
    })

    setInterval(async () => {
      const location = await getLocation()
      setLocation(location)
    }, 30000)
  }, [])

  return (
    <LocationContext.Provider value={location}>
      <div style={{ height: '100%' }}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={isLoggedIn ? <Home /> : <Signup />} />

            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/scanner' element={<Scanner />} />
            <Route path='/user' element={<User />} />
            <Route path='/personalization' element={<Personalization />} />

            {/*<Route path="/" element={<Home />} />*/}
            {/*<Route path="/search" element={<Search />} />*/}
            {/*<Route path="/quests" element={<Quests />} />*/}
            <Route path='*' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LocationContext.Provider>
  )
}

export default App
