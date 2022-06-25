import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import Joi from 'joi'
import prisma from '../../../../utils/prisma'

const userBadges: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.put('/',
    {
      preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
      schema: {
        querystring: Joi.object({
          code: Joi.string().required(),
        })
      },
      validatorCompiler: ({ schema }) => {
        return data => {
          if (data.length === 0) {
            return { error: new Error('Querystring is required') }
          }

          return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
        }
      },
    },
    async function(request, reply) {
      if (!request.user) {
        return reply.unauthorized()
      }

      const { code } = request.query as { code: string }

      if (await prisma.code.count({ where: { id: code } }) === 0) {
        return reply.notFound()
      }

      await prisma.user.update({
        where: { id: request.user.id },
        data: {
          scannedCodes: { connect: { id: code } },
        },
      })

      return reply.send()
    })
}

export default userBadges
