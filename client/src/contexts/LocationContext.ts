import { createContext } from 'react'

export type LocationContextType = [number, number]

const LocationContext = createContext<LocationContextType | undefined>(undefined);
export default LocationContext;
