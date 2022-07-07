import { useCallback, useContext, useMemo } from 'react'
import SessionActionsContext from '../contexts/SessionActionsContext'
import axiosInstance from '../utils/axiosInstance'

const useShopLikes = (shopId: number, {shopLikes, shopLiked}: { shopLikes: number, shopLiked: boolean }) => {
  const sessionActions = useContext(SessionActionsContext)

  const mergedShopLiked = useMemo(() => {
    if (sessionActions.sessionLikes?.[0].includes(shopId)) {
      return true
    }

    if (sessionActions.sessionUnlikes?.[0].includes(shopId)) {
      return false
    }

    return shopLiked
  }, [shopId, shopLikes, sessionActions.sessionLikes, sessionActions.sessionUnlikes])

  const mergedShopLikes = useMemo(() => {
    if (sessionActions.sessionLikes?.[0].includes(shopId)) {
      if (shopLiked) {
        return shopLikes
      }

      return shopLikes + 1
    }

    if (sessionActions.sessionUnlikes?.[0].includes(shopId)) {
      if (shopLiked) {
        return shopLikes - 1
      }

      return shopLikes
    }

    return shopLikes
  }, [shopId, shopLikes, sessionActions.sessionLikes, sessionActions.sessionUnlikes])

  const likeShop = useCallback(async () => {
    if (mergedShopLiked) {
      await axiosInstance.delete(`/users/me/liked-shops?shopId=${shopId}`)
      sessionActions.sessionUnlikes?.[1]([...sessionActions.sessionUnlikes[0], shopId])
      sessionActions.sessionLikes?.[1](() => sessionActions.sessionLikes?.[0].filter(id => id !== shopId) ?? [])
    } else {
      await axiosInstance.post(`/users/me/liked-shops?shopId=${shopId}`)
      sessionActions.sessionLikes?.[1]([...sessionActions.sessionLikes?.[0], shopId])
      sessionActions.sessionUnlikes?.[1](() => sessionActions.sessionUnlikes?.[0].filter(id => id !== shopId) ?? [])
    }
  }, [shopId, shopLiked, sessionActions, shopId])

  return {liked: mergedShopLiked, likes: mergedShopLikes, likeShop}
}

export default useShopLikes
