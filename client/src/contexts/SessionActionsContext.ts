import React, { createContext } from 'react'
import { Shop } from '../hooks/useShops'

type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>]

const SessionActionsContext = createContext<{
  sessionLikes?: UseState<number[]>,
  sessionUnlikes?: UseState<number[]>,
  cachedShops?: UseState<Shop[]>,
}>({})

export default SessionActionsContext
