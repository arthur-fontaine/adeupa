import React, { useState } from 'react'
import './Login.scss'
import TextButton from '../../components/TextButton/TextButton'
import TextInput from '../../components/TextInput/TextInput'
import character from '../../assets/images/Character.svg'
import axiosInstance from '../../utils/axiosInstance'

function Login() {
  const initialValues = { email: '', password: '' }
  const [email, setEmail] = useState<string>(initialValues.email)
  const [password, setPassword] = useState<string>(initialValues.password)
  const [emailError, setEmailError] = useState<string>()
  const [passwordError, setPasswordError] = useState<string>()

  const validateEmail = (email: string) => {
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/

    if (!emailRegex.test(email)) {
      return 'Email non valide' // change
    }
  }

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

    if (!passwordRegex.test(password)) {
      return 'Mot de passe non valide' // change
    }
  }

  const login:  React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    setEmailError(validateEmail(email))
    setPasswordError(validatePassword(password))

    const response = await axiosInstance.post('/sessions', {
      email,
      password,
    })
    const data = response.data

    localStorage.setItem('token', data.token)
  }

  const signup = () => {
    window.location.href = '/signup'
  }

  return (
    <div className='login-page'>
      <header className='login-page__header'>
        <img
          src={character}
          alt="person's character"
        />
      </header>
      <div className='login-page__form-container'>
        <form>
          <h2>Bon retour parmi nous !</h2>
          <div className='login-page__form'>
            <TextInput
              name='email'
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError ? <p>{emailError}</p> : null}
            <TextInput
              name='password'
              type='password'
              placeholder='Mot de passe'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError ? <p>{passwordError}</p> : null}
          </div>

          <TextButton text='Se connecter' onClick={login} />
          <p className='login-page__signup'>
            Vous n’avez pas de compte ?{' '}
            <span onClick={signup}>Inscrivez-vous</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
