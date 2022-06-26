import { FastifyPluginAsync } from 'fastify'
import prisma from './../../../utils/prisma'
import Joi from 'joi'
import includeShopFiles from '../../../utils/includeShopFiles'
import fastifyPassport from '@fastify/passport'
import PrismaClient from '@prisma/client'

const shop: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', {
    preValidation: fastifyPassport.authenticate('jwt', {
      authInfo: false,
    }, async (request, reply, err, user, _info, _status) => {
      if (err) {
        return reply.internalServerError(err.message)
      }

      if (user) {
        request.user = user as PrismaClient.User
      }
    }),
    schema: {
      querystring: Joi.object({
        include: Joi.string().valid('image', 'background', 'image,background').optional(),
      }),
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    }
  }, async function (request, reply) {
    const { shopId } = request.params as { shopId: string }
    const { include: includeRaw } = request.query as { include?: string }

    let include: string[] = includeRaw ? includeRaw.split(',') : []

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

    let shopInclude = {} as Parameters<typeof includeShopFiles>[1]

    let user: PrismaClient.User & { landscape: PrismaClient.Landscape & { enabledItems: PrismaClient.Item[]; }; } | undefined

    if (request.user) {
      user = await prisma.user.findUnique({
        where: { id: request.user.id },
        include: {
          landscape: { include: { enabledItems: true } },
        },
      }) ?? undefined
    }

    if (include.includes('image')) {
      shopInclude = {
        ...shopInclude,
        image: [shop],
      }
    }

    if (include.includes('background') && user) {
      shopInclude = {
        ...shopInclude,
        background: [shop, user],
      }
    }

    return Object.assign(shop, includeShopFiles(shop, shopInclude))
  })
}

export default shop
