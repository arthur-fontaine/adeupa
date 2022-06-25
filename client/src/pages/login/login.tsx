import { useState } from 'react'
import axios from 'axios'
import './style.scss'
import TextButton from '../../components/TextButton/TextButton'
import TextInput from '../../components/TextInput/TextInput'
import character from "../../assets/images/Character.svg"

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

  const login = async () => {
    setEmailError(validateEmail(email))
    setPasswordError(validatePassword(password))

    const response = await axios.post('http://localhost:3001/sessions', {
      email,
      password,
    })
    const data = await response.data()

    localStorage.setItem('token', data.token)
  }

  const signup = () => {}

  return (
    <div className="flex-col-center">
      <header className="flex-col-center header">
          <img
            className="header__img--size"
            src={character}
            alt="person's character"
          />
      </header>
    <div className="container">
      <form className="container__form">
        <h2 className="container__form__h2">Bon retour parmi nous !</h2>
        <div className="custom-field.one">
          <TextInput
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError ? <p>{emailError}</p> : null}
          <TextInput
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError ? <p>{passwordError}</p> : null}
        </div>
        <TextButton text="Se connecter" onClick={login} />
        <p className="container__form__p">
          Vous n’avez pas de compte ?{' '}
          <span className="container__form__p__span--link" onClick={signup}>Inscrivez-vous</span>
        </p>
      </form>
    </div>
    </div>
  )
}

export default Login
