import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import prisma from '../../../../utils/prisma'
import path from 'path'
import fs from 'fs'

namespace LandscapePersonalization {
  export const DistrictValues = ['paris-16'] as const;

  export type District = typeof DistrictValues[number];
}

const landscape: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/',
    { preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }) },
    async function(request, reply) {
      if (!request.user) {
        return reply.unauthorized()
      }

      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        include: { landscape: { include: { enabledItems: true } } },
      })

      if (!user) {
        return reply.unauthorized()
      }

      const district = user.landscape.enabledItems.find(item => item.type === 'LandscapeDistrict')?.label ?? 'paris-16'

      if (!district || !(LandscapePersonalization.DistrictValues.includes(district as any))) {
        return reply.internalServerError()
      }

      const landscapePath = path.join(__dirname, '..', '..', '..', '..', '..', 'res', 'landscape')

      let districtPath = path.join(landscapePath, district)
      if (!fs.existsSync(districtPath)) {
        districtPath = path.join(landscapePath, 'paris-16')
      }

      let shopImagePath = path.join(districtPath, 'default.png')

      const buffer = fs.readFileSync(shopImagePath)

      reply.type('image/png')
      return reply.send(buffer)
    },
  )
}

export default landscape
