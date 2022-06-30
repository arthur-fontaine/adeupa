import React from 'react'
import './NavBar.scss'
import 'remixicon/fonts/remixicon.css'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const path = window.location.pathname.split('/')[1]

  return (
    <nav data-page-opened={path === '' ? 'home' : path} className='navigation-bar'>
      <div className='box'></div>

      <div className='action-button'>
        <Link to={'/scanner'}>
          <button>
            <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M19.6667 20.7083V19.6667H16.5417V16.5417H19.6667V18.625H21.75V20.7083H20.7083V22.7917H18.625V24.875H16.5417V21.75H18.625V20.7083H19.6667ZM24.875 24.875H20.7083V22.7917H22.7917V20.7083H24.875V24.875ZM6.125 6.125H14.4583V14.4583H6.125V6.125ZM8.20833 8.20833V12.375H12.375V8.20833H8.20833ZM16.5417 6.125H24.875V14.4583H16.5417V6.125ZM18.625 8.20833V12.375H22.7917V8.20833H18.625ZM6.125 16.5417H14.4583V24.875H6.125V16.5417ZM8.20833 18.625V22.7917H12.375V18.625H8.20833ZM21.75 16.5417H24.875V18.625H21.75V16.5417ZM9.25 9.25H11.3333V11.3333H9.25V9.25ZM9.25 19.6667H11.3333V21.75H9.25V19.6667ZM19.6667 9.25H21.75V11.3333H19.6667V9.25Z'
                fill='#FCFCFC' />
              <path fillRule='evenodd' clipRule='evenodd'
                    d='M32 0H21.3333V2.13368H29.8666V8.88889H32V0ZM21.3333 29.867H29.8666V23.1111H32V32H21.3333V29.867ZM2.13325 23.1111V29.867H10.6667V32H0V23.1111H2.13325ZM10.6667 2.13368H2.13325V8.88889H0V0H10.6667V2.13368Z'
                    fill='#FCFCFC' />
            </svg>
          </button>
        </Link>
      </div>

      <Link to={'/'}>
        <div className='icon icon--home'>
          <button className='ri-home-3-line'></button>
        </div>
      </Link>

      <div className='icon icon--search'>
        <button className='ri-search-line'></button>
      </div>

      <div className='sep'></div>

      <div className='icon icon--quests'>
        <button className='ri-calendar-line'></button>
      </div>

      <Link to={'/user'}>
        <div className='icon icon--user'>
          <button className='ri-user-line'></button>
        </div>
      </Link>

    </nav>
  )
}

export default NavBar
