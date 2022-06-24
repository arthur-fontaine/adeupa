import { FastifyPluginAsync } from 'fastify'
import prisma from '../../utils/prisma'
import axios from 'axios'
import Joi from 'joi'
import bcrypt from 'bcrypt'

const users: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.post('/', {
    schema: {
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$ %^&*-]).{8,}$/).required(),
        birthdate: Joi.string().isoDate().required(),
        location: Joi.string().required(),
      }),
    },
    validatorCompiler: ({ schema }) => {
      return data => {
        if (data.length === 0) {
          return { error: new Error('Body is required') }
        }

        return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
      }
    },
  }, async function(request, reply) {
    const {
      name,
      email,
      password,
      birthdate,
      location,
    } = request.body as { name: string, email: string, password: string, birthdate: string, location: string }

    if (!name || !email || !password || !birthdate || !location) {
      return reply.badRequest('Missing required fields')
    }

    const foundLocation = await prisma.location.findFirst({
      where: { name: location },
    })

    let assignedLocation: Exclude<typeof foundLocation, null>

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

    return await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        birthdate,
        location: { connect: { id: assignedLocation.id } },
        character: { create: {} },
        landscape: { create: {} },
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
  })
}

export default users
