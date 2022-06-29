import useCharacter from '../../hooks/useCharacter'
import './Character.scss'

function Character({ character }: { character: ReturnType<typeof useCharacter> }) {
  const { currentCharacterSprite } = character

  return (
    <div className={`character character--${character.walkDirection}`}>
      {currentCharacterSprite || <div/>}
    </div>
  )
}

export default Character
