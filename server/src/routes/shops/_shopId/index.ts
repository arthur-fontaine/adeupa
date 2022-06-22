import { FastifyPluginAsync } from 'fastify'
import prisma from './../../../utils/prisma'

const shop: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    const { shopId } = request.params as { shopId: string }

    const shop = await prisma.shop.findUnique({
      where: { id: parseInt(shopId) },
      include: {
        schedules: true,
        location: true,
        tags: true,
      },
    })

    if (shop === undefined) {
      return reply.notFound()
    }

    return shop
  })
}

export default shop
