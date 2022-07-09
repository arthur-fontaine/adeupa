import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import prisma from '../../../../utils/prisma'
import moment from 'moment'

const userQuestsStreak: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', {
    preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
  }, async (request, reply) => {
    if (!request.user) {
      return reply.unauthorized()
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        completedQuests: true,
      },
    })

    if (!user) {
      return reply.unauthorized()
    }

    const { completedQuests } = user

    const streak = completedQuests.sort((completedQuestA, completedQuestB) => {
      return completedQuestB.completeDate.getTime() - completedQuestA.completeDate.getTime()
    }).reduce((streak, completedQuest, currentIndex) => {
      const { completeDate } = completedQuest
      const { completeDate: previousCompleteDate } = streak[streak.length - 1] ?? {}

      if (currentIndex === 0 && moment(completeDate).diff(moment().subtract(1, 'day'), 'days') === 0) {
        return [completedQuest]
      } else if (currentIndex === 0) {
        return []
      }

      if (currentIndex > 0 && previousCompleteDate && moment(completeDate).add(1, 'day').isSameOrAfter(previousCompleteDate, 'day')) {
        return [...streak, completedQuest]
      }

      return [completedQuest]
    }, [] as typeof completedQuests)

    return reply.send({
      streak: streak.length,
    })
  })
}

export default userQuestsStreak
