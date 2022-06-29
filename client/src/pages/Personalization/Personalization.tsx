import React, { useEffect, useState } from 'react'
import './Personalization.scss'
import { Link } from 'react-router-dom'
import Navbar from '../../components/NavBar/NavBar'
import ButtonIcon from '../../components/IconButton/IconButton'
import character from '../../assets/images/Character.svg'
import PersonalizationColor from '../../components/PersonalizationCategories/PersonalizationColor'
import PersonalizationClothes from '../../components/PersonalizationCategories/PersonalizationClothes'
import PersonalizationBackground from '../../components/PersonalizationCategories/PersonalizationBackground'
import axiosInstance from '../../utils/axiosInstance'

function Personalization() {
  const initialValues = {
    color: [''],
    clothes: [''],
    background: [''],
  }
  const [color, setColor] = useState(initialValues.color)
  const [clothes, setClothes] = useState(initialValues.clothes)
  const [background, setBackground] = useState(initialValues.background)

  const getItemsinfo = async () => {
    const response = await axiosInstance.get<{
      color: []
      clothes: []
      background: []
    }>('/items')
    setColor(response.data.color)
    setClothes(response.data.clothes)
    setBackground(response.data.background)
  }
  useEffect(() => {
    getItemsinfo().then()
  }, [])
  const [state, setState] = useState('add-color')

  const colors = ['red', 'blue', 'green', 'yellow']

  return (
    <div className="personalization-page">
      <header className="personalization-page__header --padding-top">
        <img src={character} alt="person's character" />
        <div className="personalization-page__check-button IconButton">
          <Link to="/user">
            <ButtonIcon icon="check" />
          </Link>
        </div>
      </header>

      <div className="customization">
        <h2 className="customization__title">Personnalisation</h2>
        <div className="customization__categories">
          <button
            id="color-button"
            onClick={() => setState('add-color')}
          ></button>
          <button
            id="clothes-button"
            onClick={() => setState('add-clothes')}
          ></button>
          <button
            id="background-button"
            onClick={() => setState('add-background')}
          ></button>
        </div>
        <div className="customization__content">
          <ul className="customization__ul">
            {(state === 'add-color' &&
              colors.map((data) => {
                return <PersonalizationColor color={data} id={data} />
              })) ||
              (state === 'add-clothes' &&
                colors.map((data) => {
                  return <PersonalizationClothes color={data} id={data} />
                })) ||
              (state === 'add-background' &&
                colors.map((data) => {
                  return <PersonalizationBackground color={data} id={data} />
                }))}
          </ul>
        </div>
      </div>
      <Navbar />
    </div>
  )
}

export default Personalization
