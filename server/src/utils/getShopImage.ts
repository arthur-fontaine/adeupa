import fs from 'fs'
import path from 'path'
import PrismaClient from '@prisma/client'

const getShopImage = (shop: PrismaClient.Shop): Buffer => {
  const shopsResPath = path.join(__dirname, '..', '..', 'public', 'shops')
  return fs.readFileSync(path.join(shopsResPath, shop.id.toString(), 'image.png'))
}

export default getShopImage
