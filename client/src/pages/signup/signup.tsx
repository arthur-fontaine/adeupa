import { useState } from 'react'
import axios from 'axios'
import './style.scss'
import '../../App.scss'
import TextButton from '../../components/TextButton/TextButton'
import TextInput from '../../components/TextInput/TextInput'
import character from "../../assets/images/Character.svg"

function Signup() {
  const initialValues = {
    email: '',
    password: '',
    confirm: '',
    name: '',
    birthdate: '',
    location: '',
  }
  const [email, setEmail] = useState(initialValues.email)
  const [password, setPassword] = useState(initialValues.password)
  const [confirmPassword, setConfirmPassword] = useState(initialValues.confirm)
  const [name, setName] = useState(initialValues.name)
  const [birthdate, setBirthdate] = useState(initialValues.birthdate)
  const [location, setLocation] = useState(initialValues.location)
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

  const signup: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    setEmailError(validateEmail(email))
    setPasswordError(validatePassword(password))

    await axios.post('http://localhost:3001/users', {
      email,
      password,
      birthdate,
      location,
      name,
    })

    const response = await axios.post('http://localhost:3001/sessions', {
      email,
      password,
    })
    const data = response.data

    localStorage.setItem('token', data.token)
  }

  const login = () => {}

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
          <h2 className="container__form__h2">Bienvenue parmi nous !</h2>
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
          <TextInput
            name="confirmpassword"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <TextInput
            name="name"
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            name="location"
            type="text"
            placeholder="Ville"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextInput
            name="birthdate"
            type="date"
            placeholder="Anniversaire"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
       <TextButton text="S'inscrire" onClick={signup} />
          <p className="container__form__p">
            Vous avez déjà un compte ?{' '}
            <span className="container__form__p__span--link" onClick={login}>
              Connectez-vous
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
