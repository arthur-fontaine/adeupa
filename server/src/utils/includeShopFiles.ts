import getShopImage from './getShopImage'
import getShopBackground from './getShopBackground'
import PrismaClient from '@prisma/client'

const includeShopFiles = <T extends { image?: Parameters<typeof getShopImage>; background?: Parameters<typeof getShopBackground> }>(shop: PrismaClient.Shop, {
  image,
  background,
}: T): PrismaClient.Shop & { [K in keyof T]?: string } => {
  //const shopsResPath = path.join(__dirname, '../../../public/shops')
  //
  //     shops = shops.map((shop) => ({
  //       ...shop,
  //       image: fs.readFileSync(path.join(shopsResPath, shop.id.toString(), 'image.png')).toString('base64'),
  //     }))
  //
  //     if (request.user) {
  //       const user = await prisma.user.findUnique({
  //         where: { id: request.user.id },
  //         include: {
  //           landscape: { include: { enabledItems: true } },
  //         },
  //       })
  //
  //       if (user) {
  //         shops = shops.map((shop) => ({
  //           ...shop,
  //           background: getShopBackground(shop, user).toString('base64'),
  //         }))
  //       }
  //     }

  let returnShop: ReturnType<typeof includeShopFiles> = shop

  if (image) {
    returnShop.image = getShopImage(shop).toString('base64')
  }

  if (background) {
    returnShop.background = getShopBackground(background[0], background[1], background[2]).toString('base64')
  }

  return returnShop
}

export default includeShopFiles
