import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import Joi from 'joi'
import prisma from '../../../utils/prisma'
import axios from 'axios'

const userMe: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/',
    { preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }) },
    async function(request, reply) {
      const user = request.user

      if (!user) {
        return reply.unauthorized()
      }

      return reply.send(user)
    },
  )

  fastify.put('/',
    {
      preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
      schema: {
        querystring: Joi.object({
          name: Joi.string().optional(),
          email: Joi.string().optional(),
          birthdate: Joi.date().optional(),
          location: Joi.string().optional(),
        }),
      },
      validatorCompiler: ({ schema }) => {
        return data => {
          return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
        }
      },
    },
    async function(request, reply) {
      const user = request.user

      if (!user) {
        return reply.unauthorized()
      }

      const {
        name,
        email,
        birthdate,
        location,
      } = request.query as { name?: string, email?: string; birthdate?: Date, location?: string }

      let assignedLocation: Exclude<Awaited<ReturnType<typeof prisma.location.findFirst>>, null> | undefined

      if (location) {
        const foundLocation = await prisma.location.findFirst({
          where: { name: location },
        })

        if (!foundLocation) {
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`)
          const locationData = response.data[0] as {
            lat: string
            lon: string
          }

          assignedLocation = await prisma.location.create({
            data: {
              name: location,
              latitude: parseFloat(locationData.lat),
              longitude: parseFloat(locationData.lon),
            },
          })
        } else {
          assignedLocation = foundLocation
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          email,
          birthdate,
          location: assignedLocation ? { connect: { id: assignedLocation.id } } : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          birthdate: true,
          location: {
            select: {
              name: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      })

      return reply.send(updatedUser)
    })
}

export default userMe
