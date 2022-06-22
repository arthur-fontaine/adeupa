import { FastifyPluginAsync } from 'fastify'
import prisma from './../../utils/prisma'

const search: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    const { query } = request.query as { query: string }

    if (!query) {
      return reply.badRequest('Missing query')
    }

    return await prisma.shop.findMany({
      where: {
        OR: [
          { name: { search: `+${query}` } },
          { name: { startsWith: query } },
        ],
      },
      include: {
        schedules: true,
        location: true,
        tags: true,
      },
    })
  })
}

export default search
