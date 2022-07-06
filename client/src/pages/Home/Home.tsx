import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Home.scss'
import NavBar from '../../components/NavBar/NavBar'
import CardHome from '../../components/CardHome/CardHome'
import useShops, { Shop } from '../../hooks/useShops'
import Character from '../../components/Character/Character'
import gsap, { Linear } from 'gsap'
import { SwipeEvent } from '../../events/drag'
import useCharacter from '../../hooks/useCharacter'

const SWIPE_ANIMATION_DURATION = 2.4

const Home = () => {
  const {
    currentShop,
    nextShop,
    prevShop,
    followingShops,
    precedingShops,
    setOnBeforeChangeShop,
    setOnAfterChangeShop,
  } = useShops()
  const [cardContainerSwipeEventListener, setCardContainerSwipeEventListener] = useState<(e: Event) => void>()
  const [registeredCardContainerSwipeEventListener, setRegisteredCardContainerSwipeEventListener] = useState<(e: Event) => void>()
  const character = useCharacter({ playing: false })

  const backgroundRef = useRef<HTMLDivElement>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    character.setAnimationSpeed(48)
  }, [])

  useEffect(() => {
    setOnBeforeChangeShop(() => (way: 'next' | 'prev', currentShop: Shop | undefined, newShop: Shop | undefined) => {
      return new Promise<void>(resolve => {
        if (backgroundRef.current && currentShop && newShop) {
          character.setWalkDirection(way === 'next' ? 'left' : 'right')

          gsap.fromTo(backgroundRef.current, {
            translateX: way === 'next' ? '0' : '-100vw',
          }, {
            duration: SWIPE_ANIMATION_DURATION,
            translateX: way === 'next' ? '-100vw' : '0',
            ease: Linear.easeNone,
          })
          gsap.fromTo(cardContainerRef.current, {
            rotate: '0',
          }, {
            duration: 0.5,
            rotate: way === 'next' ? '-90deg' : '90deg',
          })
          character.setPlaying(true)
          setTimeout(() => {
            character.setPlaying(false)
            resolve()
          }, SWIPE_ANIMATION_DURATION * 1000)
        } else {
          resolve()
        }
      })
    })

    setOnAfterChangeShop(() => (_way: 'next' | 'prev', currentShop: Shop | undefined) => {
      return new Promise<void>(resolve => {
        if (backgroundRef.current && currentShop) {
          gsap.fromTo(backgroundRef.current, {
            translateX: '0',
          }, {
            duration: 0,
            translateX: '0',
          })
          gsap.fromTo(cardContainerRef.current, {
            rotate: '0',
          }, {
            duration: 0,
            rotate: '0',
          })
          resolve()
        } else {
          resolve()
        }
      })
    })
  }, [backgroundRef, cardContainerRef])

  useEffect(() => {
    setCardContainerSwipeEventListener(() => (e: SwipeEvent) => {
      if (e) {
        const { detail } = e as SwipeEvent

        if (Math.abs(detail.xDelta) > 100) {
          if (detail.direction === 'left') {
            nextShop().then()
          } else {
            prevShop().then()
          }
        }
      }
    })
  }, [nextShop, prevShop])

  const wheelCardContainerRef = useCallback((cardContainer: HTMLDivElement) => {
    if (cardContainer && cardContainerSwipeEventListener) {
      if (registeredCardContainerSwipeEventListener) {
        cardContainer.removeEventListener('swipe', registeredCardContainerSwipeEventListener)
      }

      cardContainer.addEventListener('swipe', cardContainerSwipeEventListener)
      setRegisteredCardContainerSwipeEventListener(() => cardContainerSwipeEventListener)
    }
  }, [cardContainerSwipeEventListener, registeredCardContainerSwipeEventListener, setRegisteredCardContainerSwipeEventListener])

  const currentShopCard = useMemo(() => {
    if (currentShop) {
      return <CardHome shopTitle={currentShop.name} shopImage={currentShop.image || ''} shopId={currentShop.id}
                       shopLikes={currentShop.likes} shopTags={currentShop.tags.map(tag => tag.name)}
                       shopLiked={currentShop.liked}
                       shopLocation={[currentShop.location.latitude, currentShop.location.longitude]} />
    }
  }, [currentShop])

  return (
    <div className='home-page'>
      <div className='home-page__wheel-card-container' ref={wheelCardContainerRef}>
        <div className='home-page__card-container' ref={cardContainerRef}>
          {
            Array(2 - (precedingShops(2)?.length ?? 2)).fill(0).map((_, index) => (
              <div key={index} className='home-page__virtual-card card' />
            ))
          }
          {
            precedingShops(2)?.map(shop => (
              <CardHome key={shop.id} shopTitle={shop.name} shopImage={shop.image || ''} shopId={shop.id}
                        shopLikes={shop.likes} shopTags={shop.tags.map(tag => tag.name)}
                        shopLiked={shop.liked}
                        shopLocation={[shop.location.latitude, shop.location.longitude]} />
            ))
          }
          {currentShopCard}
          {
            followingShops(2)?.map(shop => (
              <CardHome key={shop.id} shopTitle={shop.name} shopImage={shop.image || ''} shopId={shop.id}
                        shopLikes={shop.likes} shopTags={shop.tags.map(tag => tag.name)}
                        shopLiked={shop.liked}
                        shopLocation={[shop.location.latitude, shop.location.longitude]} />
            ))
          }
          {
            Array(2 - (followingShops(2)?.length ?? 2)).fill(0).map((_, index) => (
              <div key={index} className='home-page__virtual-card card' />
            ))
          }
        </div>
      </div>

      <div className='home-page__character'>
        <Character character={character} />
      </div>

      <div className='home-page__background-container'>
        <div className='home-page__background' ref={backgroundRef}>
          {
            Array(2 - (precedingShops(2)?.length ?? 2)).fill(0).map((_, index) => (
              <img key={index} src='' alt='' />
            ))
          }
          {
            precedingShops(2)?.map(shop => (
              <img key={shop.id} src={`data:image/png;base64,${shop.background}`} alt='' />
            )).reverse()
          }
          <img src={`data:image/png;base64,${currentShop?.background}`} alt='' />
          {
            followingShops(2)?.map(shop => (
              <img key={shop.id} src={`data:image/png;base64,${shop.background}`} alt='' />
            ))
          }
          {
            Array(2 - (followingShops(2)?.length ?? 2)).fill(0).map((_, index) => (
              <img key={index} src='' alt='' />
            ))
          }
        </div>
      </div>

      <NavBar />
    </div>
  )
}

export default Home
