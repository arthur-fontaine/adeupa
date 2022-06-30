import React, { useContext, useEffect, useState } from 'react'
import './CardHome.scss'
import axiosInstance from '../../utils/axiosInstance'
import LocationContext from '../../contexts/LocationContext'
import { Link } from 'react-router-dom'
import calculateDistance from '../../utils/calculateDistance'

const CardHome = ({
                    shopImage,
                    shopTitle,
                    shopId,
                    shopTags,
                    shopLikes,
                    shopLocation,
                    shopLiked = false,
                  }: { shopImage: string; shopTitle: string; shopId: number; shopTags: string[]; shopLikes: number; shopLiked?: boolean; shopLocation: [number, number] }) => {
  const [shopLikedState, setShopLikedState] = useState(shopLiked)
  const [shopDistance, setShopDistance] = useState(0)
  const location = useContext(LocationContext)

  const updateDistance = () => {
    if (!location) return 0
    const d = calculateDistance(location, shopLocation)
    setShopDistance(d)
  }

  useEffect(() => {
    updateDistance()
  }, [location])

  const likeShop = async () => {
    if (shopLikedState) {
      await axiosInstance.delete(`/users/me/liked-shops?shopId=${shopId}`)
      setShopLikedState(false)
    } else {
      await axiosInstance.post(`/users/me/liked-shops?shopId=${shopId}`)
      setShopLikedState(true)
    }
  }

  return (
    <div className='home-card'>
      <div className='home-card__content'>
        <div className='home-card__img'>
          <div className='home-card__like' onClick={likeShop}>
            <i className={shopLikedState ? 'ri-heart-fill' : 'ri-heart-line'}></i>
          </div>

          <img src={`data:image/png;base64,${shopImage}`} alt={shopTitle} />

          <svg width='0' height='0'>
            <defs>
              <clipPath id='badge' clipPathUnits='objectBoundingBox'>
                <path
                  transform='scale(0.003076923076923077,0.004169446361194832)'
                  d='M0 8C0 3.58172 3.58172 0 8 0H317C321.418 0 325 3.58172 325 8V202.127C325 205.929 322.345 209.201 318.619 209.958C289.564 215.853 170.833 239.84 162.5 239.84C154.167 239.84 35.4363 215.853 6.38121 209.958C2.65463 209.201 0 205.929 0 202.127V8Z'
                  fill='#D9D9D9'
                />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className='home-card__description'>
          <h1 className='home-card__title'>{shopTitle}</h1>

          <div className='home-card__stats'>
            <h3 className='mention'>
              <div className='distance'>
                <i className='ri-route-line'></i>
                <span>{shopDistance.toFixed(1)}km</span>
              </div>

              <div className='like'>
                <i className='ri-heart-line'></i>
                <span>{shopLikes + (!shopLiked && shopLikedState ? 1 : shopLiked && !shopLikedState ? -1 : 0)}</span>
              </div>
            </h3>
          </div>

          <div className='home-card__badges'>
            {shopTags.map(tag => (<div className='home-card__badge' key={tag}>{tag}</div>))}
          </div>
        </div>
      </div>

      <footer>
        <div className='home-card__footer-background'></div>

        <div className='home-card__button-container'>
          <Link to={`/shops/${shopId}`}>
            <div className='home-card__button'>Voir plus</div>
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default CardHome
