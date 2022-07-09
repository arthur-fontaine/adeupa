import './CardQuest.scss'

function CardQuest({ quest }: { quest: { name: string; description: string; } }) {
  return (
    <div className='card-quest'>
      <h3 className='card-quest__name'>{quest.name}</h3>
      <p className='card-quest__description'>{quest.description}</p>
    </div>
  )
}

export default CardQuest
