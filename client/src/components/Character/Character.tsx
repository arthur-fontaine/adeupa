import useCharacter from '../../hooks/useCharacter'
import './Character.scss'

function Character({ character }: { character: ReturnType<typeof useCharacter> }) {
  return (
    <div className={`character character--${character?.walkDirection}`}>
      {(character && character.currentCharacterSprite) || <div />}
    </div>
  )
}

export default Character
