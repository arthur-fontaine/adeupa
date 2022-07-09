import NavBar from '../../components/NavBar/NavBar'
import axiosInstance from '../../utils/axiosInstance'
import { useEffect, useState } from 'react'
import CardQuest from '../../components/CardQuest/CardQuest'
import './Quests.scss'
import moment from 'moment'

function Quests() {
  const [quests, setQuests] = useState<{
    id: number
    name: string
    description: string
    completed: boolean
    completedAt?: string
  }[]>([])
  const [questsStreak, setQuestsStreak] = useState<number | null>(null)
  const [openedDetailIndex, setOpenedDetailIndex] = useState<number>(0)

  const fetchQuests = async () => {
    const quests = await axiosInstance.get<{
      id: number
      name: string
      description: string
      completed: boolean
      completedAt?: string
    }[]>('/quests')
    setQuests(quests.data)
  }

  const fetchQuestsStreak = async () => {
    const questsStreak = await axiosInstance.get<{
      streak: number
    }>('/users/me/quests-streak')
    setQuestsStreak(questsStreak.data.streak)
  }

  useEffect(() => {
    fetchQuests().then()
    fetchQuestsStreak().then()
  }, [])

  return <div className='quests-page'>
    <div>
      {(questsStreak && questsStreak > 1) ?
        <div className='quests-page__streak'>
          <i className='ri-fire-fill'></i>
          Série de {questsStreak} jours
        </div> : null}

      {quests.filter(quest => !quest.completed).length > 0 &&
        <div className='quests-page__quests quests-page__quests--available'>
          <h2>Quêtes disponibles</h2>
          <div>
            {quests.filter(quest => !quest.completed).map(quest => <CardQuest quest={quest} key={quest.id} />)}
          </div>
        </div>}

      {quests.filter(quest => quest.completed).length > 0 &&
        <div className='quests-page__quests quests-page__quests--completed'>
          <h2>Quêtes terminées</h2>
          <div>
            {Object.entries(quests.filter(quest => quest.completed).reduce((acc, quest) => {
              const completedAt = moment(quest.completedAt)
              let groupDate: keyof typeof acc

              if (completedAt.isSame(moment(), 'day')) {
                groupDate = 'today'
              } else if (completedAt.isSame(moment().subtract(1, 'day'), 'day')) {
                groupDate = 'yesterday'
              } else if (completedAt.isAfter(moment().subtract(7, 'days'))) {
                groupDate = 'lastWeek'
              } else if (completedAt.isAfter(moment().subtract(30, 'days'))) {
                groupDate = 'lastMonth'
              } else {
                groupDate = 'older'
              }

              if (!acc[groupDate]) {
                acc[groupDate] = [quest]
              } else {
                acc[groupDate]!.push(quest)
              }

              return acc
            }, {} as { today?: typeof quests, yesterday?: typeof quests, lastWeek?: typeof quests, lastMonth?: typeof quests, older?: typeof quests })).map(([dateGroup, quests], i) => (
              <div data-details={true} key={dateGroup} data-open={i === openedDetailIndex}>
                <p data-summary={true} onClick={() => {
                  if (openedDetailIndex !== i) {
                    setOpenedDetailIndex(i)
                  }
                }}><i className='ri-arrow-right-s-fill'></i><span>{{
                  today: 'Aujourd\'hui',
                  yesterday: 'Hier',
                  lastWeek: 'Dernière semaine',
                  lastMonth: 'Dernier mois',
                  older: 'Il y a plus d\'un mois'
                }[dateGroup]}</span></p>
                <div data-content={true}>
                  {quests.map(quest => <CardQuest quest={quest} key={quest.id} />)}
                </div>
              </div>
            ))}
          </div>
        </div>}
    </div>

    <NavBar />
  </div>
}

export default Quests
