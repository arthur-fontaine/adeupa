import { FastifyPluginAsync } from 'fastify'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import prisma from './../../../../utils/prisma'

const shopImage: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    const { shopId } = request.params as { shopId: string }

    if (
      (await prisma.shop.count({
        where: { id: parseInt(shopId) },
      })) === 0
    ) {
      return reply.notFound()
    }

    const buffer = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'shops', shopId, 'image.png'))

    const stream = new Readable({
        read () {
          this.push(buffer)
          this.push(null)
        }
      })
    
      reply.type('image/png')
      return reply.send(stream)
  })
}

export default shopImage
