import { FastifyPluginAsync } from 'fastify'
import prisma from './../../utils/prisma'
import includeShopFiles from '../../utils/includeShopFiles'

const search: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function(request, reply) {
    const { query, include } = request.query as { query: string; include?: 'image' }

    if (!query) {
      return reply.badRequest('Missing query')
    }

    if (include && include !== 'image') {
      return reply.badRequest('Invalid include')
    }

    const shops = await prisma.shop.findMany({
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
        likedBy: true,
      },
    })

    return shops.map((shop) => {
      if (include && include.includes('image')) {
        try {
          return Object.assign(shop, includeShopFiles(shop, {
            image: [shop],
          }))
        } catch (e) {
          return shop
        }
      } else {
        return shop
      }
    })
  })
}

export default search
