import PrismaClient from '@prisma/client'
import fs from 'fs'
import path from 'path'

const getShopBackground = (shop: PrismaClient.Shop, user: (PrismaClient.User & {landscape: PrismaClient.Landscape & {enabledItems: PrismaClient.Item[]}}), {defaultDistrict}: {defaultDistrict: 'paris-16'} = {defaultDistrict: 'paris-16'}): Buffer => {
  const district = user.landscape.enabledItems.find(item => item.type === 'LandscapeDistrict')?.label ?? defaultDistrict

  const landscapePath = path.join(__dirname, '..', '..', 'res', 'landscape')

  let districtPath = path.join(landscapePath, district)
  if (!fs.existsSync(districtPath)) {
    districtPath = path.join(landscapePath, defaultDistrict)
  }

  let shopImagePath = path.join(districtPath, `${shop.type ?? 'default'}.png`)
  if (!fs.existsSync(shopImagePath)) {
    shopImagePath = path.join(districtPath, 'default.png')
  }

  return fs.readFileSync(shopImagePath)
}

export default getShopBackground
