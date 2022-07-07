import React, { useState, useEffect, useContext, useCallback } from 'react'
import ButtonIcon from '../../components/IconButton/IconButton'
import { useParams } from 'react-router-dom'
import './Shop.scss'
import axiosInstance from '../../utils/axiosInstance'
import calculateDistance from '../../utils/calculateDistance'
import LocationContext from '../../contexts/LocationContext'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import useShopLikes from '../../hooks/useShopLikes'

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const

const parseDateSchedule = (schedule: Date): { weekDay: string; hour: string } => {
  const scheduleMoment = moment(schedule)
  const startMoment = moment(new Date(0))

  const weekDayNumber = scheduleMoment.diff(startMoment, 'days') % 7
  const weekDay = days[weekDayNumber]

  const hour = scheduleMoment.format('HH:mm')

  return { weekDay, hour }
}

type Schedule = { startHour: string; endHour: string }

const parseSchedules = (schedules: { startTime: Date, endTime: Date }[]): { [p: string]: Schedule[] } => {
  return Object.fromEntries(Object.entries(schedules.map(schedule => {
      const { weekDay, hour: startHour } = parseDateSchedule(schedule.startTime)
      const { hour: endHour } = parseDateSchedule(schedule.endTime)
      return { weekDay, startHour, endHour }
    },
  ).reduce((acc, { weekDay, startHour, endHour }) => {
    if (acc[weekDay]) {
      acc[weekDay].push({ startHour, endHour })
    } else {
      acc[weekDay] = [{ startHour, endHour }]
    }
    return acc
  }, {} as ReturnType<typeof parseSchedules>)))
}

function Shop() {
  let { shopId: shopIdParam } = useParams()
  const shopId = Number(shopIdParam)

  const initialValues = {
    name: '',
    image: '',
    distance: 0,
    like: 0,
    tags: [] as { id: number, name: string }[],
    description: '',
    shopLocation: [0, 0] as [number, number],
    address: '',
    schedules: [] as { id: number, startTime: Date, endTime: Date }[],
  }

  const [name, setName] = useState(initialValues.name)
  const [image, setImage] = useState(initialValues.image)
  const [distance, setDistance] = useState(initialValues.distance)
  const [likes, setLikes] = useState(initialValues.like)
  const [liked, setLiked] = useState(false)
  const [tags, setTags] = useState(initialValues.tags)
  const [description, setDescription] = useState(initialValues.description)
  const [schedules, setSchedules] = useState(initialValues.schedules)
  const [shopLocation, setShopLocation] = useState(initialValues.shopLocation)
  const [address, setAddress] = useState(initialValues.address)

  const navigate = useNavigate()
  const location = useContext(LocationContext)
  const { liked: mergedShopLiked, likes: mergedShopLikes, likeShop } = useShopLikes(shopId, {
    shopLikes: likes,
    shopLiked: liked,
  })

  const getShopInfo = async () => {
    const response = await axiosInstance.get<{
      name: string
      image: string
      likes: number
      liked: boolean
      tags: { id: number, name: string }[]
      location: {
        id: number
        latitude: number
        longitude: number
        name: string
      }
      description: string
      schedules: { id: number, startTime: string, endTime: string }[],
    }>(`/shops/${shopId}?include=image`)
    setName(response.data.name)
    setImage(response.data.image)
    setLikes(response.data.likes)
    setLiked(response.data.liked)
    setTags(response.data.tags)
    setDescription(response.data.description)
    setSchedules(response.data.schedules.map(schedule => ({
      id: schedule.id,
      startTime: new Date(schedule.startTime),
      endTime: new Date(schedule.endTime),
    })))
    setShopLocation([response.data.location.latitude, response.data.location.longitude])
    setAddress(response.data.location.name)
    updateDistance()
  }

  const updateDistance = useCallback(() => {
    if (!location) return 0
    const d = calculateDistance(location, shopLocation)
    setDistance(d)
  }, [setDistance, location, shopLocation])

  useEffect(() => {
    updateDistance()
  }, [location, shopLocation])

  useEffect(() => {
    getShopInfo().then()
  }, [])

  return (
    <div className='shop-page'>
      <div className='shop-page__back' onClick={() => navigate(-1)}>
        <ButtonIcon icon='arrow' />
      </div>

      <img src={`data:image/png;base64,${image}`} alt='shop' className='shop-page__cover' />

      <div className='shop-page__like' onClick={likeShop}>
        <i className={mergedShopLiked ? 'ri-heart-fill' : 'ri-heart-line'}></i>
      </div>

      <div className='shop-page__data'>
        <h2 className='shop-page__name'>{name}</h2>

        <div className='shop-page__stats'>
          <div>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='17' height='17'>
              <path fill='none' d='M0 0h24v24H0z' />
              <path
                d='M4 15V8.5a4.5 4.5 0 0 1 9 0v7a2.5 2.5 0 1 0 5 0V8.83a3.001 3.001 0 1 1 2 0v6.67a4.5 4.5 0 1 1-9 0v-7a2.5 2.5 0 0 0-5 0V15h3l-4 5-4-5h3zm15-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
                fill='#1d094e' />
            </svg>
            <span>{distance.toFixed(1)}km</span>
          </div>

          <div>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='17' height='17'>
              <path fill='none' d='M0 0H24V24H0z' />
              <path
                d='M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z'
                fill='#1d094e' />
            </svg>
            <span>{mergedShopLikes}</span>
          </div>
        </div>

        <div className='shop-page__tags'>
          {tags && tags.map(tag => <div className='shop-page__tag'>{tag.name}</div>)}
        </div>

        <div className='shop-page__schedules'>
          <h3>Horaires</h3>
          {schedules && Object.entries(parseSchedules(schedules)).map(([day, schedule], i) => {
            return (
              <div key={i} className='shop-page__schedule'>
                <p>{day}</p>
                <div>
                  {
                    schedule.map(s => s.startHour).map((startHour, j) => {
                      return (
                        <p key={j}>{startHour} - {schedule.map(s => s.endHour)[j]}</p>
                      )
                    })
                  }
                </div>
              </div>
            )
          })}
        </div>

        <div className='shop-page__description'>
          <h3>Description</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default Shop
