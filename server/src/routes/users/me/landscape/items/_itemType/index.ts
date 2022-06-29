import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import prisma from './../../../../../../utils/prisma'
import PrismaClient from '@prisma/client'

const itemUnlocked = (item: PrismaClient.Item & { requiredBadges: PrismaClient.Badge[] }, user: PrismaClient.User & { earnedBadges: PrismaClient.Badge[] }): boolean => {
  for (let index = 0; index < item.requiredBadges.length; index++) {
    const requiredBadge = item.requiredBadges[index]
    if (!user.earnedBadges.find((earnedBadge) => earnedBadge.id === requiredBadge.id)) {
      return false
    }
  }

  return true
}

const landscapeItem: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    '/',
    { preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }) },
    async function(request, reply) {
      if (!request.user) {
        return reply.unauthorized()
      }

      const { itemType } = request.params as { itemType: string }

      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        include: { earnedBadges: true },
      })

      if (!user) {
        return reply.unauthorized()
      }

      if (itemType !== 'district') {
        return reply.badRequest(
          'itemType should be equal to "district"'
        )
      }

      const items = await prisma.item.findMany({
        where: {
          ownedBy: { every: { id: user.id } },
          type: itemType === 'district' ? 'LandscapeDistrict' : 'LandscapeDistrict',
        },
        include: {
          requiredBadges: true,
        },
      })

      const filteredItems = items.map((item) => {
        return {
          ...item,
          unlocked: itemUnlocked(item, user),
        }
      })

      return reply.send({ items: filteredItems })
    },
  )

  fastify.put(
    '/',
    { preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }) },
    async function(request, reply) {
      const { itemType } = request.params as { itemType: string }
      const { itemId } = request.query as { itemId: string }

      if (!request.user) {
        return reply.unauthorized()
      }

      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        include: { earnedBadges: true },
      })

      if (!user) {
        return reply.unauthorized()
      }

      if (itemType !== 'district') {
        return reply.badRequest(
          'itemType should be equal to "district"'
        )
      }

      const character = await prisma.character.findFirst({
        where: {
          user: { id: user.id },
        },
      })

      if (!character) {
        return reply.notFound()
      }

      const item = await prisma.item.findFirst({
        where: {
          id: parseInt(itemId),
          type: itemType === 'district' ? 'LandscapeDistrict' : 'LandscapeDistrict',
        },
        include: { requiredBadges: true },
      })

      if (!item) {
        return reply.notFound()
      }

      if (!itemUnlocked(item, user)) {
        return reply.unauthorized()
      }

      const currentSelectedItem = await prisma.item.findFirst({
        where: {
          associatedCharacters: { some: { id: character.id } },
          type: itemType === 'district' ? 'LandscapeDistrict' : 'LandscapeDistrict',
        },
      })

      await prisma.character.update({
        where: {
          id: character.id,
        },
        data: {
          enabledItems: {
            disconnect: currentSelectedItem ? { id: currentSelectedItem.id } : undefined,
            connect: [{ id: parseInt(itemId) }],
          },
        },
      })

      return reply.send()
    },
  )
}

export default landscapeItem
