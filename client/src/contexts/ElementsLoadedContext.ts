import React, { createContext } from 'react'

type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>]

const ElementsLoadedContext = createContext<{
  firstShop?: UseState<boolean>,
  character?: UseState<boolean>,
}>({})

export default ElementsLoadedContext
