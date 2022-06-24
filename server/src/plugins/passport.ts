import fastifyPassport from '@fastify/passport'
import fp from 'fastify-plugin'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import prisma from '../utils/prisma'
import { User } from '@prisma/client'
import 'dotenv/config'

export default fp(async (fastify, _opts) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required')
  }

  fastify.register(fastifyPassport.initialize())
  fastify.register(fastifyPassport.secureSession())

  fastifyPassport.registerUserSerializer(async (user: Partial<User>, _request) => user.id)
  fastifyPassport.registerUserDeserializer(async (id: number, _request) => {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return null
    }

    return user
  });

  fastifyPassport.use(
    'jwt',
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    }, async (jwtPayload: User, done) => {
      let user: Partial<User> | null

      try {
        user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
          select: {
            id: true,
            email: true,
            name: true,
            birthdate: true,
            location: {
              select: {
                name: true,
                latitude: true,
                longitude: true,
              }
            }
          }
        })
      } catch (err) {
        return done(err, false)
      }

      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    }),
  )
}, {
  name: 'passport',
  dependencies: ['secure-session'],
})

declare module 'fastify' {
  interface PassportUser extends Partial<User> {
  }
}
