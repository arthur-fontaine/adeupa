import { FastifyPluginAsync } from 'fastify'
import Joi from 'joi'
import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const sessions: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required')
  }

  fastify.post('/', {
    schema: {
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        if (data.length === 0) {
          return { error: new Error('Body is required') }
        }

        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    },
  }, async function(request, reply) {
    const {
      email,
      password,
    } = request.body as { email: string, password: string }

    const foundUser = await prisma.user.findFirst({
      where: { email },
    })

    if (!foundUser) {
      return reply.badRequest('Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password)

    if (!isValidPassword) {
      return reply.badRequest('Invalid email or password')
    }

    const jwtToken = jwt.sign(foundUser, process.env.JWT_SECRET!, { expiresIn: '1d' })

    return reply.send({
      token: jwtToken,
    })
  })
}

export default sessions
