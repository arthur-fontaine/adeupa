import { FastifyPluginAsync } from 'fastify'
import moment from 'moment'
import prisma from './../../utils/prisma'
import fastifyPassport from '@fastify/passport'
import PrismaClient from '@prisma/client'
import includeShopFiles from '../../utils/includeShopFiles'
import Joi from 'joi'

type coordinates = [number, number]

const calculateDistance = (pointA: coordinates, pointB: coordinates) => {
  const R = 6371
  const dLat = deg2rad(pointB[0] - pointA[0])
  const dLon = deg2rad(pointB[1] - pointA[1])

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(pointA[0])) *
    Math.cos(deg2rad(pointB[0])) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
}

const shops: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
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
        limit: Joi.number().integer().min(1).max(100).default(10).optional(),
        include: Joi.string().valid('image', 'background', 'image,background').optional(),
        sortBy: Joi.string().regex(/\[(distanceFrom)=(((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?))]/).optional(),
        filterBy: Joi.string().regex(/\[(state)=((open)|(close))]/).optional(),
        offset: Joi.number().integer().min(0).default(0).optional(),
      })
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    }
  }, async function(request, reply) {
    let {
      limit: limitRaw,
      sortBy: sortByRaw,
      filterBy: filterByRaw,
      offset: offsetRaw,
      include: includeRaw,
    } = request.query as {
      limit?: string
      sortBy?: string
      filterBy?: string
      offset?: string
      include?: string
    }

    let limit: number = limitRaw ? parseInt(limitRaw) : 10
    let sortBy: { distanceFrom?: coordinates } = {}
    let filterBy: { state?: 'open' | 'close' } = {}
    let offset: number = offsetRaw ? parseInt(offsetRaw) : 0
    let include: string[] = includeRaw ? includeRaw.split(',') : []

    if (limit > 100) {
      limit = 100
    }

    const regex = /\[([a-zA-Z]+)=(.+)]/

    if (sortByRaw) {
      const match = sortByRaw.match(regex)

      if (match && match.length >= 2) {
        if (match[1] === 'distanceFrom') {
          const sortByKey = match[1]
          let sortByValueRaw: string = match[2]

          const sortByValueParsed = sortByValueRaw.split(',').map(parseFloat)

          if (sortByValueParsed.length === 2) {
            sortBy = {
              [sortByKey]: sortByValueRaw.split(',').map(parseFloat) as [
                number,
                number
              ],
            }
          } else {
            return reply.badRequest('sortBy[distanceFrom] should have 2 values')
          }
        } else {
          return reply.badRequest(`${match[1]} is not supported for sortBy`)
        }
      } else {
        return reply.badRequest('sortBy is not properly formatted')
      }
    }

    if (filterByRaw) {
      const match = filterByRaw.match(regex)

      if (match && match.length >= 2) {
        if (match[1] === 'state') {
          const filterByKey = match[1]

          if (match[2] === 'open' || match[2] === 'close') {
            filterBy = { [filterByKey]: match[2] }
          } else {
            return reply.badRequest(`${match[1]} is not supported for sortBy`)
          }
        }
      } else {
        return reply.badRequest('filterBy is not properly formatted')
      }
    }

    let shops = await prisma.shop.findMany({
      include: {
        schedules: true,
        location: true,
        tags: true,
      },
    })

    if (filterBy) {
      if (filterBy.state) {
        const weekStamp = moment(moment().diff(moment().startOf('isoWeek')))
        shops = shops.filter((shop) =>
          shop.schedules.find(
            (schedule) =>
              weekStamp.isAfter(moment(schedule.startTime)) &&
              moment(schedule.endTime).isAfter(weekStamp),
          ),
        )
      }
    }

    if (sortBy) {
      if (sortBy.distanceFrom) {
        shops = shops.sort(
          (shopA, shopB) =>
            calculateDistance(
              [shopA.location.latitude, shopA.location.longitude],
              sortBy.distanceFrom!,
            ) -
            calculateDistance(
              [shopB.location.latitude, shopB.location.longitude],
              sortBy.distanceFrom!,
            ),
        )
      }
    }

    shops = shops.slice(offset, offset + limit)

    let user: PrismaClient.User & { landscape: PrismaClient.Landscape & { enabledItems: PrismaClient.Item[]; }; } | undefined

    if (request.user) {
      user = await prisma.user.findUnique({
        where: { id: request.user.id },
        include: {
          landscape: { include: { enabledItems: true } },
        },
      }) ?? undefined
    }

    shops = shops.map((shop) => {
      let shopInclude = {} as Parameters<typeof includeShopFiles>[1]

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

    return shops
  })
}

export default shops
