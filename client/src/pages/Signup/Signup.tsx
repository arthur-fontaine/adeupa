import { useState } from 'react'
import './Signup.scss'
import '../../App.scss'
import TextButton from '../../components/TextButton/TextButton'
import TextInput from '../../components/TextInput/TextInput'
import character from '../../assets/images/Character.svg'
import axiosInstance from '../../utils/axiosInstance'
// import background from '../../assets/images/Background.png'

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

    await axiosInstance.post('/users', {
      email,
      password,
      birthdate,
      location,
      name,
    })

    const response = await axiosInstance.post('/sessions', {
      email,
      password,
    })
    const data = response.data

    localStorage.setItem('token', data.token)
  }

  const login = () => {
    window.location.href = '/login'
  }

  return (
    <div className='signup-page'>
      {/* <img className='signup-page__background'
      src={background}
      alt="background"
      /> */}
      <header className='signup-page__header'>
        <img
          src={character}
          alt="person's character"
        />
      </header>
      <div className='signup-page__form-container'>
        <form>
          <h2>Bienvenue parmi nous !</h2>
          <div className='container__form'>
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
            <TextInput
              name='confirmpassword'
              type='password'
              placeholder='Confirmer le mot de passe'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <TextInput
              name='name'
              type='text'
              placeholder='Nom'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              name='location'
              type='text'
              placeholder='Ville'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextInput
              name='birthdate'
              type='date'
              placeholder='Anniversaire'
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>

          <TextButton text="S'inscrire" onClick={signup} />
          <p className='signup-page__login'>
            Vous avez déjà un compte ?{' '}
            <span onClick={login}>
              Connectez-vous
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
