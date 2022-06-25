import React from 'react';
import './App.scss'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './pages/login/login';
import Signup from './pages/signup/signup';

function App() {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <div style={{ height: "100%" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn ? <div/> : <Signup />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/*<Route path="/" element={<Home />} />*/}
          {/*<Route path="/search" element={<Search />} />*/}
          {/*<Route path="/quests" element={<Quests />} />*/}
          {/*<Route path="/user" element={<User />} />*/}
          {/*<Route path="*" element={<Home />} />*/}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
