import { FastifyPluginAsync } from 'fastify'
import prisma from '../../../utils/prisma'
import fs from 'fs'
import path from 'path'
import Joi from 'joi'

const code: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      querystring: Joi.object({
        include: Joi.string().valid('image').optional(),
      })
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        if (data.length === 0) {
          return { error: new Error('Querystring is required') }
        }

        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    }
  }, async (request, reply) => {
    const { codeId } = request.params as { codeId: string }
    const { include } = request.query as { include?: string }

    const code = await prisma.code.findUnique({
      where: { id: codeId },
    })

    if (!code) {
      return reply.notFound()
    }

    if (include === 'image') {
      const buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'codes', codeId, 'image.png'))

      Object.assign(code, {
        image: buffer.toString('base64'),
      })
    }

    return reply.send(code)
  })
}

export default code
