import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import prisma from '../../../../../utils/prisma'
import generateCharacter from '../../../../../utils/generateCharacter'
import { CharacterPersonalization } from '../index'

const characterFrameI: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get(
    '/',
    { preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }) },
    async function(request, reply) {
      if (!request.user) {
        return reply.unauthorized()
      }

      const { frameI } = request.params as { frameI: string }

      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        include: { earnedBadges: true, character: { include: { enabledItems: true } } },
      })

      if (!user) {
        return reply.unauthorized()
      }

      const characterColor = user.character.enabledItems.find(item => item.type === 'CharacterColor')?.label ?? 'red'
      const characterClothes = user.character.enabledItems.find(item => item.type === 'CharacterClothes')?.label ?? 'nothing'

      if (!characterColor || !(CharacterPersonalization.ColorValues.includes(characterColor as any))) {
        return reply.internalServerError()
      }

      if (!characterClothes || !(CharacterPersonalization.BodyValues.includes(characterClothes as any))) {
        return reply.internalServerError()
      }

      const characterImage = await generateCharacter({
        color: characterColor as CharacterPersonalization.Color,
        body: characterClothes as CharacterPersonalization.Body,
      }, parseInt(frameI))

      reply.type('image/png')
      return reply.send(characterImage[0])
    },
  )
}

export default characterFrameI
