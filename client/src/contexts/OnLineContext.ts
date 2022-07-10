import { createContext } from 'react'

export type OnLineContextType = boolean

const OnLineContext = createContext<OnLineContextType>(true);
export default OnLineContext;
