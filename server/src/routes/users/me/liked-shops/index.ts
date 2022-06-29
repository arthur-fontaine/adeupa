import { FastifyPluginAsync } from 'fastify'
import Joi from 'joi'
import fastifyPassport from '@fastify/passport'
import prisma from '../../../../utils/prisma'

const userLikedShops: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.post('/',
    {
      preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
      schema: {
        querystring: Joi.object({
          shopId: Joi.string().required(),
        }),
      },
      validatorCompiler: ({ schema }) => {
        return data => {
          if (data.length === 0) {
            return { error: new Error('Querystring is required') }
          }

          return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
        }
      }
    },
    async function(request, reply) {
      if (!request.user) {
        return reply.unauthorized()
      }

      const { shopId } = request.query as { shopId: string }

      await prisma.user.update({
        where: { id: request.user.id },
        data: {
          likedShops: { connect: [{ id: parseInt(shopId) }] },
        },
      })

      return reply.send()
    }
  )

  fastify.delete('/',
    {
      preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
      schema: {
        querystring: Joi.object({
          shopId: Joi.string().required(),
        }),
      },
      validatorCompiler: ({ schema }) => {
        return data => {
          if (data.length === 0) {
            return { error: new Error('Querystring is required') }
          }

          return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
        }
      }
    },
    async function(request, reply) {
      if (!request.user) {
        return reply.unauthorized()
      }

      const { shopId } = request.query as { shopId: string }

      await prisma.user.update({
        where: { id: request.user.id },
        data: {
          likedShops: { disconnect: { id: parseInt(shopId) } },
        },
      })

      return reply.send()
    }
  )
}

export default userLikedShops
