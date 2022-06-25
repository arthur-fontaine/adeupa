import React, { useState } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import TextInput from '../../components/TextInput/TextInput'
import IconButton from '../../components/IconButton/IconButton'
import character from '../../assets/images/Character.svg'
import './User.scss'

function User() {
  const initialValues = {
    email: '',
    password: '',
    birthdate: '',
    location: '',
  }

  const [email, setEmail] = useState(initialValues.email)
  const [password, setPassword] = useState(initialValues.password)
  const [birthdate, setBirthdate] = useState(initialValues.birthdate)
  const [location, setLocation] = useState(initialValues.location)

  return (
    <div className='user-page'>
      <header className='user-page__header'>
        <div className='user-page__profile-picture'>
          <img
            src={character}
            alt="person's character"
          />
        </div>
        <h2>Claire Dupuis</h2>

        <div className='user-page__edit-button'><IconButton icon='modify' /></div>
      </header>

      <div className='user-page__informations'>
        <TextInput name='email' type='text' value={email} placeholder='Email' onChange={(e) => {
          setEmail(e.target.value)
        }} />
        <TextInput name='password' type='password' value={password} placeholder='Mot de passe' onChange={(e) => {
          setPassword(e.target.value)
        }} />
        <TextInput name='birthdate' type='date' value={birthdate} placeholder="Date d'anniversaire" onChange={(e) => {
          setBirthdate(e.target.value)
        }} />
        <TextInput name='location' type='text' value={location} placeholder='Localisation' onChange={(e) => {
          setLocation(e.target.value)
        }} />
      </div>

      <NavBar />
    </div>
  )
}

export default User
