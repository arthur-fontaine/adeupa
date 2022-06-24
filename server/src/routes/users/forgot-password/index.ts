import { FastifyPluginAsync } from 'fastify'
import prisma from '../../../utils/prisma'
import Joi from 'joi'
import bcrypt from 'bcrypt'

const forgotPassword: FastifyPluginAsync = async (
  fastify,
  _opts
): Promise<void> => {
  fastify.put(
    '/',
    {
      schema: {
        querystring: Joi.object({
          token: Joi.string().required(),
          newPassword: Joi.string().min(8).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$ %^&*-]).{8,}$/).required(),
        }),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => {
          if (data.length === 0) {
            return { error: new Error('Querystring is required') }
          }
          
          return (schema as unknown as ReturnType<typeof Joi.object>).validate(
            data
          )
        }
      },
    },
    async function (request, reply) {
      const { token, newPassword } = request.query as { token: string, newPassword: string }
      const passwordResetRequest = await prisma.passwordResetRequest.findUnique({
        where: { token }
      })

      if (!passwordResetRequest) {
        return reply.notFound()
      }

      await prisma.user.update({
          where: {id: passwordResetRequest.userId},
          data: {password: await bcrypt.hash(newPassword, 10),}
      })

      return reply.send()
    }
  )
}

export default forgotPassword
