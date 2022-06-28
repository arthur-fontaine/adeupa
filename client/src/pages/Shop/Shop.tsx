import React, { useState, useEffect } from 'react'
import ButtonIcon from '../../components/IconButton/IconButton'
import { useParams } from "react-router-dom";
// import ShopImage from ...
import './Shop.scss'
import axiosInstance from '../../utils/axiosInstance'

function Shop() {

    let { shopId } = useParams();

    const initialValues = {
        name: '',
        image: '',
        distance: 0,
        like: 0,
        tags: [] as {id: number, name: string}[],
        description: '',
        schedules: [] as {id: number, startTime: Date, endTime: Date}[],
      }
    
      const [name, setName] = useState(initialValues.name)
      const [image, setImage] = useState(initialValues.image)
      const [distance, setDistance] = useState(initialValues.distance)
      const [like, setLike] = useState(initialValues.like)
      const [tags, setTags] = useState(initialValues.tags)
      const [description, setDescription] = useState(initialValues.description)
      const [schedules, setSchedules] = useState(initialValues.schedules)

      const getShopInfo = async () => {
        const response = await axiosInstance.get<{
          name: string
          image: string
          distance: number
          like: number
          tags: {id: number, name: string}[]
          description: string
          schedules: {id: number, startTime: Date, endTime: Date}[],
        }>(`/shops/${shopId}?include=image`)
        setName(response.data.name)
        setImage(response.data.image)
        setDistance(response.data.distance)
        setLike(response.data.like)
        setTags(response.data.tags)
        setDescription(response.data.description)            
        setSchedules(response.data.schedules)
        console.log(response.data);
                   
      }
    
      useEffect(() => {
        getShopInfo().then()
      }, [])

    return (
        <div className="shop-page">
            <div className="shop-page__button">
                <ButtonIcon icon="arrow"/>
            </div>

            <img src={`data:image/png;base64,${image}`} alt="shop" className="shop-page__image" />

            <div className="shop-page__heart">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z" fill="#1d094e"/></svg>
            </div>

            <div className="shop-page__data">
                <h2 className='shop-page__data--name'>{name}</h2>

                <div className="shop-page__data--block-data">
                    <div className="shop-page__data--block-data--data">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 15V8.5a4.5 4.5 0 0 1 9 0v7a2.5 2.5 0 1 0 5 0V8.83a3.001 3.001 0 1 1 2 0v6.67a4.5 4.5 0 1 1-9 0v-7a2.5 2.5 0 0 0-5 0V15h3l-4 5-4-5h3zm15-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#1d094e"/></svg>
                        <span>{distance} m</span>
                    </div>

                    <div className="shop-page__data--block-data--data">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17"><path fill="none" d="M0 0H24V24H0z"/><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z" fill="#1d094e"/></svg>
                        <span>{like}</span>
                    </div> 
                </div>

                <div className="shop-page__data--block-type">
                    {tags && tags.map(tag => <Type name={tag.name} key={tag.id}/>)}
                </div>

                <div className="shop-page__data--hourly">
                    <h3 className='shop-page__data--hourly--title'>Horaires</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" fill="#fe6363"/></svg>
                </div>
                <div className="shop-page__data--day">
                {schedules && schedules.map(schedule => <Hourly startHour={schedule.startTime} endHour={schedule.endTime} key={schedule.id}/>)}
                </div>
                <h3 className='shop-page__data--description-title'>Description</h3>
                <p className='shop-page__data--description-text'>{description}</p>
            </div>
        </div>
    )
}

function Type({ name }: { name: string }) {

    return(
        <div className="shop-page__data--block-type--type">
            <label className="shop-page__data--block-type--type--name">{name}</label>
        </div>
    )
}

function Hourly({ startHour, endHour }: { startHour: Date, endHour: Date }) {
    let daysOfWeek = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    let numberOfDays = 0;
    numberOfDays = numberOfDays + 1;

    return(
        <div className="shop-page__data--day--hourly">
            <p>{daysOfWeek[numberOfDays]}</p>
            <p>{startHour.toDateString()} - {endHour.toDateString()}</p>
            <p>{startHour.toDateString()} - {endHour.toDateString()}</p>
        </div>
    )
}

export default Shop