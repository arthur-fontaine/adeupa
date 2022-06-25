import { FastifyPluginAsync } from 'fastify'
import prisma from './../../../utils/prisma'
import Joi from 'joi'
import path from 'path'
import fs from 'fs'

const shop: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      querystring: Joi.object({
        include: Joi.string().valid('image').optional(),
      }),
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    }
  }, async function (request, reply) {
    const { shopId } = request.params as { shopId: string }
    const { include } = request.query as { include?: string }

    const shop = await prisma.shop.findUnique({
      where: { id: parseInt(shopId) },
      include: {
        schedules: true,
        location: true,
        tags: true,
      },
    })

    if (shop === null) {
      return reply.notFound()
    }

    if (include === 'image') {
      const buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'shops', shopId, 'image.png'))

      Object.assign(shop, {
        image: buffer.toString('base64'),
      })
    }

    return shop
  })
}

export default shop
