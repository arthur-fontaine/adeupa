import './IconButton.scss'

function ButtonIcon({ icon, onClick }: { icon: 'check' | 'arrow' | 'share' | 'modify', onClick?: () => void }) {
  let svg

  if (icon === 'check') {
    svg = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z' fill='rgba(255,255,255,1)' />
    </svg>
  } else if (icon === 'arrow') {
    svg = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z' fill='rgba(255,255,255,1)' />
    </svg>
  } else if (icon === 'share') {
    svg = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path
        d='M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12l7-7z'
        fill='rgba(255,255,255,1)' />
    </svg>
  } else if (icon === 'modify') {
    svg = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path
        d='M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z'
        fill='rgba(255,255,255,1)' />
    </svg>
  }

  return (
    <div className='icon-button' onClick={onClick}>
      <button>
        {svg}
      </button>
    </div>
  )
}

export default ButtonIcon
