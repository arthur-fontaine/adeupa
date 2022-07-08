import { createContext } from 'react'
import useCharacter from '../hooks/useCharacter'

export type CharacterContextType = ReturnType<typeof useCharacter> | null

const CharacterContext = createContext<CharacterContextType>(null);
export default CharacterContext;
