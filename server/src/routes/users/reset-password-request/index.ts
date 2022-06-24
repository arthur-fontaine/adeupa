import { FastifyPluginAsync } from 'fastify'
import prisma from '../../../utils/prisma'
import Joi from 'joi'

const resetPassword: FastifyPluginAsync = async (
  fastify,
  _opts
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: Joi.object({
          email: Joi.string().email().required(),
        }),
      },
      validatorCompiler: ({ schema }) => {
        return (data) => {
          if (data.length === 0) {
            return { error: new Error('Body is required') }
          }

          return (schema as unknown as ReturnType<typeof Joi.object>).validate(
            data
          )
        }
      },
    },
    async function (request, reply) {
      const { email } = request.body as { email: string }
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.notFound()
      }

      const passwordResetRequest = await prisma.passwordResetRequest.create({
        data: { user: { connect: { id: user.id } } },
      })

      // TODO: Send email

      console.log(passwordResetRequest)
    }
  )
}

export default resetPassword