import './style.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import IconButton from './../../components/IconButton/IconButton'
import axiosInstance from './../../utils/axiosInstance'
import Accomplishment from './../../components/Accomplishment/Accomplishment'
import { useNavigate } from 'react-router-dom'

localStorage.setItem('qr-save', '[]')

interface IAccomplishment { id: string, image: string, description: string }

function Scanner() {
  const [accomplishment, setAccomplishment] = useState<IAccomplishment>()
  const accomplishmentCard = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const processQR = useCallback(async ({ data }: QrScanner.ScanResult) => {
    const alreadySavedData = JSON.parse(localStorage.getItem('qr-save') ?? '[]') as string[]

    if (!alreadySavedData.includes(data)) {
      localStorage.setItem('qr-save', JSON.stringify([...alreadySavedData, data]))

      const response = await axiosInstance.get<IAccomplishment>(`/codes/${data}?include=image`)
      setAccomplishment(response.data)

      if (accomplishmentCard.current) {
        accomplishmentCard.current.classList.add('qr-page__accomplishment-card-container--slide-in')
      }

      await axiosInstance.put(`/users/me/scanned-codes?code=${response.data.id}`)

      setTimeout(() => {
        if (accomplishmentCard.current) {
          accomplishmentCard.current.classList.remove('qr-page__accomplishment-card-container--slide-in')
          accomplishmentCard.current.classList.add('qr-page__accomplishment-card-container--slide-out')

          setTimeout(() => {
            accomplishmentCard.current!.classList.remove('qr-page__accomplishment-card-container--slide-out')
            setAccomplishment(undefined)
          }, 500)
        } else {
          setAccomplishment(undefined)
        }
      }, 5000)
    }
  }, [accomplishment, setAccomplishment, accomplishmentCard])

  useEffect(() => {
    console.log(accomplishmentCard)
  }, [accomplishmentCard])

  const onRefChange = useCallback((node: HTMLVideoElement) => {
    if (node === null) {
    } else {
      const scanner = new QrScanner(
        node,
        processQR,
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          calculateScanRegion: (video) => {
            const scanRegionSize = 200
            return {
              x: Math.round((video.videoWidth - scanRegionSize) / 2),
              y: Math.round((video.videoHeight - scanRegionSize) / 2),
              width: scanRegionSize,
              height: scanRegionSize,
              downScaledWidth: 400,
              downScaledHeight: 400,
            }
          },
        })

      scanner.start().then(() => {
      })
    }
  }, [])

  return (
    <div className='qr-page'>
      <IconButton icon='arrow' onClick={() => { navigate(-1) }} />

      <video ref={onRefChange} />

      <div ref={accomplishmentCard} className='qr-page__accomplishment-card-container'>
        {accomplishment && <Accomplishment id={accomplishment.id} image={accomplishment.image} description={accomplishment.description} />}
      </div>
    </div>
  )
}

export default Scanner
