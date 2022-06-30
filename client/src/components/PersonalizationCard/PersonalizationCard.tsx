import { TabName } from '../../pages/Personalization/Personalization'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import './PersonalizationCard.scss'

interface GetItemsResponse {
  items: [{
    id: string
    value: string
    label: string
    unlocked: boolean
    selected: boolean
  }]
}

function PersonalizationCard<T extends TabName>({ tab, getLandscape, getCharacter }: { tab: T, getLandscape?: () => Promise<void>, getCharacter?: () => Promise<void> }) {
  const [items, setItems] = useState<GetItemsResponse['items']>()

  const getColor = async () => {
    return setItems((await axiosInstance.get<GetItemsResponse>('/users/me/character/items/color')).data.items)
  }

  const getClothes = async () => {
    return setItems((await axiosInstance.get<GetItemsResponse>('/users/me/character/items/clothes')).data.items)
  }

  const getDistrict = async () => {
    return setItems((await axiosInstance.get<GetItemsResponse>('/users/me/landscape/items/district')).data.items)
  }

  const getItems = useCallback(async () => {
    switch (tab) {
      case 'color':
        return getColor()
      case 'clothes':
        return getClothes()
      case 'district':
        return getDistrict()
      default:
        return []
    }
  }, [tab])

  useEffect(() => {
    getItems().then()
  }, [tab])

  const selectItem = useCallback(async (id: string) => {
    await axiosInstance.put(`/users/me/character/items/${tab}?itemId=${id}`)
    getItems().then()

    switch (tab) {
      case 'color':
      case 'clothes':
        getCharacter && await getCharacter()
        break
      case 'district':
        getLandscape && await getLandscape()
    }
  }, [tab, getItems, getCharacter, getLandscape])

  return (
    <div className='personalization-card'>
      <ul>
        {items && [...items.filter(item => item.unlocked), ...items.filter(item => !item.unlocked)].map((item) => {
          if (tab === 'color') {
            return <li className='personalization-card__item personalization-card__item--color' data-color={item.value}
                       key={item.value} style={{ backgroundColor: item.value }} data-unlocked={item.unlocked}
                       data-selected={item.selected} onClick={item.unlocked ? () => selectItem(item.id) : () => {}}></li>
          } else if (tab === 'clothes') {
            return <li className='personalization-card__item personalization-card__item--clothes'
                       data-clothes={item.value} key={item.value} style={{ backgroundColor: item.value }} data-unlocked={item.unlocked}
                       data-selected={item.selected} onClick={item.unlocked ? () => selectItem(item.id) : () => {}}></li>
          } else if (tab === 'district') {
            return <li className='personalization-card__item personalization-card__item--district'
                       data-district={item.value} key={item.value} style={{ backgroundColor: item.value }} data-unlocked={item.unlocked}
                       data-selected={item.selected} onClick={item.unlocked ? () => selectItem(item.id) : () => {}}></li>
          }
        })}
      </ul>
    </div>
  )
}

export default PersonalizationCard
