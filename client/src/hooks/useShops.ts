import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'

export interface Shop {
  id: number;
  name: string;
  description: string;
  type: string;
  phoneNumber: string;
  website: string;
  codeId: string;
  locationId: number;
  schedules: any[];
  location: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  }
  tags: {
    id: number;
    name: string;
  }[];
  likes: number;
  liked?: boolean;
  image?: string;
  background?: string;
}

const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([])
  const [currentShop, setCurrentShop] = useState<Shop>()
  const [onBeforeChangeShop, setOnBeforeChangeShop] = useState<(t: 'next' | 'prev', currentShop?: Shop, nextShop?: Shop) => Promise<void>>()
  const [onAfterChangeShop, setOnAfterChangeShop] = useState<(t: 'next' | 'prev', currentShop?: Shop, nextShop?: Shop) => Promise<void>>()

  const nextShop = useCallback(async () => {
    const nextShop = shops[(currentShop ? shops.indexOf(currentShop) + 1 : 0)]

    if (onBeforeChangeShop) {
      await onBeforeChangeShop('next', currentShop, nextShop)
    }

    if (nextShop) {
      setCurrentShop(() => nextShop)
    }

    if (onAfterChangeShop) {
      await onAfterChangeShop('next', currentShop, nextShop)
    }
  }, [shops, currentShop])

  const prevShop = useCallback(async () => {
    const prevShop = shops[(currentShop ? shops.indexOf(currentShop) - 1 : 0)]

    if (onBeforeChangeShop) {
      await onBeforeChangeShop('prev', currentShop, prevShop)
    }

    if (prevShop) {
      setCurrentShop(() => prevShop)
    }

    if (onAfterChangeShop) {
      await onAfterChangeShop('prev', currentShop, prevShop)
    }
  }, [shops, currentShop])

  const fetchShops = async (limit: number, offset: number) => {
    const response = await axiosInstance.get<Shop[]>(`/shops?include=image,background&limit=${limit}&offset=${offset}`)
    setShops((shops) => [...shops, ...response.data])
  }

  const followingShops = useCallback((i: number) => {
    if (currentShop) {
      const currentShopIndex = shops.indexOf(currentShop)
      return shops.slice(currentShopIndex + 1, currentShopIndex + i + 1)
    }
  }, [currentShop, shops])

  const precedingShops = useCallback((i: number) => {
    if (currentShop) {
      const currentShopIndex = shops.indexOf(currentShop)
      return shops.slice(currentShopIndex - i < 0 ? 0 : currentShopIndex - i, currentShopIndex)
    }
  }, [currentShop, shops])

  useEffect(() => {
    if (currentShop && shops.length - shops.indexOf(currentShop) < 10) {
      fetchShops(10 - (shops.length - shops.indexOf(currentShop)), shops.length).then()
    }
  }, [currentShop, shops])

  useEffect(() => {
    if (shops.length > 0 && !currentShop) {
      nextShop().then()
    }
  }, [shops])

  useEffect(() => {
    fetchShops(10, 0).then()
  }, [])

  return { shops, currentShop, nextShop, prevShop, fetchShops, followingShops, precedingShops, setOnBeforeChangeShop, setOnAfterChangeShop }
}

export default useShops
