import React from 'react'
import './App.scss'
import character from './images/Character.svg'
import Input from './components/Input'
import ButtonIcon from './components/iconButton'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="flex-col-center">
      <header className="flex-col-center header">
        <div className="header__background header__profile-picture-container">
          <img
            className="header__profile-picture-container__img--size"
            src={character}
            alt="person's character"
          />
        </div>
        <div className="icon-pos">{ButtonIcon('modify')}</div>
        <h2 className="header__h2--margin">Claire Dupuis</h2>
      </header>
      <div className="information">
        <label>Email</label>
        <Input />
        <label>Mot de passe</label>
        <Input />
        <label>Date d'anniversaire</label>
        <Input />
        <label>Localisation</label>
        <Input />
      </div>
      <div className="navbar">
        <Navbar />
      </div>
    </div>
  )
}

export default App
