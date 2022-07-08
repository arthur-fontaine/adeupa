import React, { useCallback, useContext, useEffect, useState } from 'react'
import './Personalization.scss'
import { Link } from 'react-router-dom'
import IconButton from '../../components/IconButton/IconButton'
import PersonalizationCard from '../../components/PersonalizationCard/PersonalizationCard'
import axiosInstance from '../../utils/axiosInstance'
import CharacterContext from '../../contexts/CharacterContext'

export type TabName = 'color' | 'clothes' | 'district'

function Personalization() {
  const [tabOpened, setTabOpened] = useState<TabName>('color')
  const [landscape, setLandscape] = useState<string>()

  const { characterSprites } = useContext(CharacterContext)

  const getLandscape = useCallback(async () => {
    const response = await axiosInstance.get('/users/me/landscape', {responseType: 'arraybuffer'})
    setLandscape(window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']})))
  }, [setLandscape])

  useEffect(() => {
    getLandscape().then()
  }, [])

  return (
    <div className='personalization-page'>
      <header className='personalization-page__header'>
        {landscape && <img src={landscape} className='personalization-page__landscape' alt='landscape' />}
        {characterSprites[0] && <img src={characterSprites[0].props.src} className='personalization-page__character' alt='character' />}

        <div className='personalization-page__check-button personalization-page__icon-button--check'>
          <Link to='/user'>
            <IconButton icon='check' />
          </Link>
        </div>
      </header>

      <div className='customization'>
        <h2 className='customization__title'>Personnalisation</h2>
        <div className='customization__categories'>
          {
            (['color', 'clothes', 'district'] as const).map((tab) => {
              return (
                <button
                  key={tab}
                  id={`${tab}-button`}
                  data-selected={tabOpened === tab}
                  onClick={() => setTabOpened(tab)}
                ></button>
              )
            })
          }
        </div>

        <PersonalizationCard tab={tabOpened} getLandscape={getLandscape} />
      </div>
    </div>
  )
}

export default Personalization
