import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import generateCharacter from '../../../../utils/generateCharacter'
import prisma from '../../../../utils/prisma'
import fs from 'fs'
import path from 'path'

const userCharacter: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', {
    preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
  }, async (request, reply) => {
    if (!request.user) {
      return reply.unauthorized()
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        character: {
          include: { enabledItems: true },
        },
      },
    })

    if (!user) {
      return reply.unauthorized()
    }

    const characterColor = user.character.enabledItems.find(item => item.type === 'CharacterColor')?.value
    const characterClothes = user.character.enabledItems.find(item => item.type === 'CharacterClothes')?.value ?? 'nothing'

    if (!characterColor || characterColor !== 'red') {
      return reply.internalServerError()
    }

    if (characterClothes !== 'nothing') {
      return reply.internalServerError()
    }

    const cachePath = path.join(__dirname, '..', '..', '..', '..', '..', 'cache', 'users', user.id.toString(), 'character.json')
    const cacheExists = fs.existsSync(cachePath)

    if (cacheExists) {
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8')) as {
        response: string[];
        date: number;
        props: {
          color: 'red';
          body: 'nothing';
        }
      }

      if (cache.props.color === characterColor && cache.props.body === characterClothes && cache.date > Date.now() - 1000 * 60 * 60 * 24) {
        return reply.send(cache.response)
      }
    }

    const characterImages = await generateCharacter({
      color: characterColor,
      body: characterClothes,
    })

    if (!cacheExists) {
      fs.mkdirSync(path.dirname(cachePath), { recursive: true })
    }

    const encodedImages = characterImages.map(image => image.toString('base64'))

    fs.writeFileSync(cachePath, JSON.stringify({
      response: encodedImages,
      date: Date.now(),
      props: {
        color: characterColor,
        body: characterClothes,
      },
    }))

    return reply.send(encodedImages)
  })
}

export default userCharacter
