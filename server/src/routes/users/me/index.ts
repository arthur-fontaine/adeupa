import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'

const userMe: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/',
    { preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }) },
    async function(request, reply) {
      const user = request.user

      if (!user) {
        return reply.unauthorized()
      }

      return reply.send(user)
    },
  )
}

export default userMe
