import { FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'
import Joi from 'joi'
import prisma from '../../../../utils/prisma'

const userBadges: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.put('/',
    {
      preValidation: fastifyPassport.authenticate('jwt', { authInfo: false }),
      schema: {
        querystring: Joi.object({
          code: Joi.string().required(),
        }),
      },
      validatorCompiler: ({ schema }) => {
        return data => {
          if (data.length === 0) {
            return { error: new Error('Querystring is required') }
          }

          return (schema as unknown as ReturnType<typeof Joi.object>).validate(data)
        }
      },
    },
    async function(request, reply) {
      if (!request.user) {
        return reply.unauthorized()
      }

      const { code: codeId } = request.query as { code: string }

      const code = await prisma.code.findUnique({
        where: { id: codeId },
        include: {
          associatedQuestMissions: {
            include: {
              associatedQuests: {
                include: {
                  badge: true,
                },
              },
            },
          },
        },
      })

      if (!code) {
        return reply.notFound()
      }

      // if (code.associatedQuestMissions.length > 0) {
      //   code.associatedQuestMissions.forEach((questMission) => {
      //     if (questMission.associatedQuests.length > 0) {
      //       questMission.associatedQuests.forEach(async (quest) => {
      //         await prisma.quest.update({
      //           where: { id: quest.id },
      //           data: {
      //             associatedCompletedQuests: {
      //               create: {
      //                 user: {
      //                   connect: {
      //                     id: user.id,
      //                   }
      //                 },
      //                 completeDate: new Date(),
      //               }
      //             }
      //           }
      //         })
      //       })
      //     }
      //   })
      // }

      const user = await prisma.user.update({
        where: { id: request.user.id },
        data: {
          scannedCodes: { connect: { id: code.id } },
        },
        include: {
          scannedCodes: {
            include: {
              associatedQuestMissions: {
                include: {
                  associatedQuests: {
                    include: {
                      badge: true,
                      missions: {
                        include: {
                          requiredCode: {
                            include: {
                              associatedUsers: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })

      for (const scannedCode of user.scannedCodes) {
        for (const questMission of scannedCode.associatedQuestMissions) {
          for (const quest of questMission.associatedQuests) {
            if (quest.missions.every(mission => mission.requiredCode.associatedUsers.some(userB => userB.id === user.id))) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  completedQuests: {
                    create: {
                      quest: {
                        connect: {
                          id: quest.id,
                        },
                      },
                      completeDate: new Date(),
                    },
                  },
                  earnedBadges: {
                    connect: quest.badge.map(badge => ({ id: badge.id })),
                  },
                },
              })
            }
          }
        }
      }

      return reply.send()
    })
}

export default userBadges
