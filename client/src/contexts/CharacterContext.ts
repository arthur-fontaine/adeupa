import { createContext } from 'react'
import useCharacter from '../hooks/useCharacter'

export type CharacterContextType = ReturnType<typeof useCharacter>

const CharacterContext = createContext<CharacterContextType>(null as any);
export default CharacterContext;
