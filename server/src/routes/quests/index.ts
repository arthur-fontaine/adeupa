import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import prisma from '../../utils/prisma'
import Joi from 'joi'
import { Prisma } from '@prisma/client'

const quests: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', {
    preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
    schema: {
      querystring: Joi.object({
        filter: Joi.string().valid('all', 'completed', 'incomplete').optional(),
      }),
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    },
  }, async (request, reply) => {
    if (!request.user) {
      return reply.unauthorized()
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        completedQuests: {
          include: {
            quest: {
              select: { id: true },
            },
          },
        },
      },
    })

    if (!user) {
      return reply.unauthorized()
    }

    const { filter } = request.query as { filter: string }

    let questFilter: Prisma.QuestWhereInput

    if (filter === 'completed') {
      questFilter = {
        id: {
          in: user.completedQuests.map(({ id }) => id) ?? [],
        },
      }
    } else if (filter === 'incomplete') {
      questFilter = {
        id: {
          notIn: user.completedQuests.map(({ id }) => id) ?? [],
        },
      }
    } else {
      questFilter = {}
    }

    const quests = await prisma.quest.findMany({ where: questFilter  })

    return reply.send(quests.map(quest => {
      const completedQuest = user.completedQuests.find((completedQuest) => completedQuest.quest.id === quest.id)

      return {
        ...quest,
        completed: completedQuest !== undefined,
        completedAt: completedQuest?.completeDate,
      }
    }))
  })
}

export default quests
