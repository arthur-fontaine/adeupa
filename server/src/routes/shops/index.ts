import { FastifyPluginAsync } from 'fastify'
import moment from 'moment'
import prisma from './../../utils/prisma'

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
  const d = R * c

  return d
}

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
}

const shops: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    let {
      limit: limitRaw,
      sortBy: sortByRaw,
      filterBy: filterByRaw,
      next: nextRaw,
    } = request.query as {
      limit?: string
      sortBy?: string
      filterBy?: string
      next?: string
    }

    let limit: number = limitRaw ? parseInt(limitRaw) : 10
    let sortBy: { distanceFrom?: coordinates } = {}
    let filterBy: { state?: 'open' | 'close' } = {}
    let next: number = nextRaw ? parseInt(nextRaw) : 0

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
              moment(schedule.endTime).isAfter(weekStamp)
          )
        )
      }
    }

    if (sortBy) {
      if (sortBy.distanceFrom) {
        shops = shops.sort(
          (shopA, shopB) =>
            calculateDistance(
              [shopA.location.latitude, shopA.location.longitude],
              sortBy.distanceFrom!
            ) -
            calculateDistance(
              [shopB.location.latitude, shopB.location.longitude],
              sortBy.distanceFrom!
            )
        )
      }
    }

    shops = shops.slice(next, next + limit)

    return shops
  })
}

export default shops
