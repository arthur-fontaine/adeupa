import './style.scss'

function Accomplishment({ image, description }: { id: string, image: string, description: string }) {
  return (
    <div className='accomplishment-card'>
      <div className='accomplishment-card__content'>
        <img className='accomplishment-card__image' src={`data:image/png;base64,${image}`} alt='accomplishment' />
        <div className='accomplishment-card__text'>
          <h2>Nouvel accomplissement</h2>
          <p>{ description }</p>
        </div>
      </div>
    </div>
  )
}

export default Accomplishment
