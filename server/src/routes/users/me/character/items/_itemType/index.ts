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

const itemSelected = (item: PrismaClient.Item & { requiredBadges: PrismaClient.Badge[], associatedCharacters: (PrismaClient.Character & { user: PrismaClient.User | null })[] }, user: PrismaClient.User): boolean => {
  return item.associatedCharacters.find((associatedCharacter) => associatedCharacter.user?.id === user.id) !== undefined
}

const characterItem: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
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

      if (itemType !== 'color' && itemType !== 'clothes') {
        return reply.badRequest(
          'itemType should be equal to "color" or "clothes"',
        )
      }

      const items = await prisma.item.findMany({
        where: {
          ownedBy: { every: { id: user.id } },
          type: itemType === 'color' ? 'CharacterColor' : 'CharacterClothes',
        },
        include: {
          requiredBadges: true,
          associatedCharacters: {
            include: {
              user: true,
            },
          },
        },
      })

      const filteredItems = items.map((item) => {
        return {
          ...item,
          unlocked: itemUnlocked(item, user),
          selected: itemSelected(item, user),
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

      if (itemType !== 'color' && itemType !== 'clothes') {
        return reply.badRequest(
          'itemType should be equal to "color" or "clothes"',
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
          type: itemType === 'color' ? 'CharacterColor' : 'CharacterClothes',
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
          type: itemType === 'color' ? 'CharacterColor' : 'CharacterClothes',
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

export default characterItem
