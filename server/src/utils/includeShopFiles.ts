import getShopImage from './getShopImage'
import getShopBackground from './getShopBackground'
import PrismaClient from '@prisma/client'

const includeShopFiles = <T extends { image?: Parameters<typeof getShopImage>; background?: Parameters<typeof getShopBackground>, likes?: [], liked?: [PrismaClient.User] }>(
  shop: PrismaClient.Shop & { likedBy: PrismaClient.User[]; },
  {
    image,
    background,
    likes,
    liked,
  }: T): PrismaClient.Shop & { [K in keyof T]?: string | number | boolean } => {
  let returnShop: ReturnType<typeof includeShopFiles> = shop

  if (image) {
    returnShop.image = getShopImage(shop).toString('base64')
  }

  if (background) {
    returnShop.background = getShopBackground(background[0], background[1], background[2]).toString('base64')
  }

  if (likes) {
    returnShop.likes = shop.likedBy.length
  }

  if (liked) {
    returnShop.liked = shop.likedBy.some(user => user.id === liked[0].id)
  }

  return returnShop
}

export default includeShopFiles
