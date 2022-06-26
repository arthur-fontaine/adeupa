import { faker } from '@faker-js/faker'
import prisma from './prisma'

const createShop = async () => {
  await prisma.shop.create({
    data: {
      name: faker.company.companyName(),
      description: faker.company.catchPhrase(),
      phoneNumber: faker.phone.number(),
      website: faker.internet.url(),
      code: { create: {} },
      location: {
        create: {
          name: faker.address.city(),
          latitude: parseFloat(faker.address.latitude()),
          longitude: parseFloat(faker.address.longitude()),
        },
      },
    },
  })
}

// const createUser = async () => {
//   await prisma.user.create({
//     data: {
//       name: faker.name.firstName(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       birthdate: faker.date.past(),
//       location: {
//         create: {
//           name: faker.address.city(),
//           latitude: parseFloat(faker.address.latitude()),
//           longitude: parseFloat(faker.address.longitude()),
//         },
//       },
//       character: {
//         create: {},
//       },
//       landscape: {
//         create: {},
//       },
//     },
//   })
// }

const fakerDatabase = async () => {
  for (let i = 0; i < 100; i++) {
    await createShop()
    // await createUser()
  }
}

(async () => {
  await fakerDatabase()
})()
