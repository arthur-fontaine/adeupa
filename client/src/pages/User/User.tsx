import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import TextInput from '../../components/TextInput/TextInput'
import IconButton from '../../components/IconButton/IconButton'
import './User.scss'
import axiosInstance from '../../utils/axiosInstance'
import CharacterContext from '../../contexts/CharacterContext'
import OnLineContext from '../../contexts/OnLineContext'

function User() {
  const onLine = useContext(OnLineContext)

  const initialValues = {
    name: '',
    email: '',
    password: '',
    birthdate: '',
    location: '',
  }

  const [name, setName] = useState(initialValues.name)
  const [email, setEmail] = useState(initialValues.email)
  const [birthdate, setBirthdate] = useState(initialValues.birthdate)
  const [location, setLocation] = useState(initialValues.location)

  const character = useContext(CharacterContext)

  const getUserInfo = async () => {
    const response = await axiosInstance.get<{
      name: string
      email: string
      birthdate: string
      id: number
      location: {
        longitude: number
        latitude: number
        name: string
      }
    }>('/users/me')
    setName(response.data.name)
    setEmail(response.data.email)
    setBirthdate(response.data.birthdate.split('T')[0])
    setLocation(response.data.location.name)
  }

  useEffect(() => {
    getUserInfo().then()
  }, [])

  const updateUserInfo = async (
    type: 'name' | 'email' | 'birthdate' | 'location',
    value: string,
  ) => {
    await axiosInstance.put(`/users/me?${type}=${value}`)
  }

  return (
    <div className='user-page'>
      <header className='user-page__header'>
        <div className='user-page__profile-picture'>
          {character && character?.currentCharacterSprite}
        </div>
        <h2
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            if (e.target.textContent && e.target.textContent !== name) {
              updateUserInfo('name', e.target.textContent).then()
            }
          }}
        >
          {name}
        </h2>

        {onLine && <Link to='/personalization'>
          <div className='user-page__edit-button'>
            <IconButton icon='modify' />
          </div>
        </Link>}
      </header>

      <div className='user-page__informations'>
        <TextInput
          name='email'
          type='text'
          value={email}
          placeholder='Email'
          disabled={!onLine}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          onBlur={(e) => {
            updateUserInfo('email', e.target.value).then()
          }}
        />
        <TextInput
          name='birthdate'
          type='date'
          value={birthdate}
          placeholder="Date d'anniversaire"
          disabled={!onLine}
          onChange={(e) => {
            setBirthdate(e.target.value)
          }}
          onBlur={(e) => {
            updateUserInfo('birthdate', e.target.value).then()
          }}
        />
        <TextInput
          name='location'
          type='text'
          value={location}
          placeholder='Localisation'
          disabled={!onLine}
          onChange={(e) => {
            setLocation(e.target.value)
          }}
          onBlur={(e) => {
            updateUserInfo('location', e.target.value).then()
          }}
        />
      </div>

      <NavBar />
    </div>
  )
}

export default User
