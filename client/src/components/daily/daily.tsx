import CardSearch from './CardSearch/CardSearch'
import './daily.scss'

function Daily({
  image,
  title,
  adress,
}: {
  title: string
  adress: string
  image: string
}) {
  return (
    <div className="quests-page__daily">
      <CardSearch title adress image />
      <CardSearch title adress image />
      <CardSearch title adress image />
      <CardSearch title adress image />
    </div>
  )
}

export default Daily
