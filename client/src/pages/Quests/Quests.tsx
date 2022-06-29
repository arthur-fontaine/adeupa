import React, { useEffect, useState } from 'react'
import Card from '../../components/Card/Card'
import Event from '../../components/event/event'
import Dail from '../../components/daily/daily'
import Image from '../../components/Image/Image'
import './Quests.scss'
import axiosInstance from '../../utils/axiosInstance'

function Daily() {
  const initialValues = {
    name: '',
    adress: '',
    image: '',
  }

  const [name, setName] = useState(initialValues.name)
  const [adress, setAdress] = useState(initialValues.adress)
  const [image, setImage] = useState(initialValues.image)

  const getQuestsInfo = async () => {
    const response = await axiosInstance.get<{
      name: string
      adress: string
      image: string
    }>('/quests')
    setName(response.data.name)
    setAdress(response.data.adress)
    setImage(response.data.image)
  }
  useEffect(() => {
    getQuestsInfo().then()
  }, [])

  const [state, setState] = useState('daily')

  return (
    <div className="quests-page">
      <div className="quests-page__header">
        <h2
          className="quests-page__header--title"
          onClick={() => setState('daily')}
        >
          {' '}
          Daily{' '}
        </h2>
        <h2
          className="quests-page__header--title"
          onClick={() => setState('event')}
        >
          {' '}
          Évènements{' '}
        </h2>
      </div>

      {(state === 'daily' && <Card />) || (state === 'event' && <Image />)}

      <div className="quests-page__footer">
        <div className="quests-page__footer--line"></div>
        <h3 className="quests-page__footer--title">Quêtes de la journée</h3>
        <div className="quests-page__footer--line"></div>
      </div>

      {(state === 'daily' && <Dail />) || (state === 'event' && <Event />)}
    </div>
  )
}

export default Daily
