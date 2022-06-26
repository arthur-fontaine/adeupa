import React from 'react';
import './App.scss'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import User from './pages/User/User'
import Home from './pages/Home/Home'

function App() {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <div style={{ height: "100%" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Signup />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<User />} />

          {/*<Route path="/" element={<Home />} />*/}
          {/*<Route path="/search" element={<Search />} />*/}
          {/*<Route path="/quests" element={<Quests />} />*/}
          {/*<Route path="*" element={<Home />} />*/}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
