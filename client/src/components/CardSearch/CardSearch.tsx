import React from 'react'
import './CardSearch.scss'
import { useNavigate } from 'react-router-dom'

function CardSearch({ image, title, address, id, onClick }: { title: string, address: string, image: string, id: number, onClick?: () => void }) {
  const navigate = useNavigate()

  return (
    <div className='card-search' onClick={() => {
      if (onClick) {
        onClick()
      }

      navigate(`/shops/${id}`)
    }}>
      <img src={`data:image/png;base64,${image}`} alt='' className='card-search__image' />
      <div className='card-search__block-data'>
        <p className='card-search__block-data--tittle'>{title}</p>
        <span className='card-search__block-data--adress'>{address}</span>
      </div>
    </div>
  )
}

export default CardSearch
