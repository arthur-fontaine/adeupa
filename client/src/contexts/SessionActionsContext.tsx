import React, { createContext } from 'react'

const SessionActionsContext = createContext<{
  sessionLikes?: [number[], React.Dispatch<React.SetStateAction<number[]>>],
  sessionUnlikes?: [number[], React.Dispatch<React.SetStateAction<number[]>>]
}>({})

export default SessionActionsContext
