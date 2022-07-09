import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import prisma from '../../../../utils/prisma'
import Joi from 'joi'
import includeShopFiles from '../../../../utils/includeShopFiles'

const userSearchHistory: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', {
    preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
  }, async function(request, reply) {
    if (!request.user) {
      return reply.unauthorized()
    }

    const searchHistories = await prisma.userSearchHistory.findMany({
      where: { user: { id: request.user.id } },
      select: {
        shop: {
          include: {
            location: true,
            likedBy: true,
          },
        },
        searchDate: true,
      },
      orderBy: {
        searchDate: 'desc',
      },
      take: 20,
    })

    for (const searchHistory of searchHistories) {
      const shop = searchHistory.shop

      if (shop) {
        Object.assign(searchHistory, {
          shop: includeShopFiles(shop, {
            image: [shop],
          }),
        })
      }
    }

    return reply.send(searchHistories)
  })

  fastify.put('/', {
    preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
    schema: {
      querystring: Joi.object({
        shopId: Joi.number().required(),
      }),
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        if (data.length === 0) {
          return { error: new Error('Querystring is required') }
        }

        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    },
  }, async function(request, reply) {
    if (!request.user) {
      return reply.unauthorized()
    }

    const { shopId } = request.query as { shopId: string }

    await prisma.userSearchHistory.create({
      data: {
        user: {
          connect: {
            id: request.user.id,
          },
        },
        shop: {
          connect: {
            id: parseInt(shopId),
          },
        },
        searchDate: new Date(),
      },
    })

    return reply.status(201).send()
  })
}

export default userSearchHistory
