import fs from 'fs'
import path from 'path'
import canvas from 'canvas'
import { CharacterPersonalization } from '../routes/users/me/character'

const generateCharacter = async ({
                                   color,
                                   body,
                                 }: { color: CharacterPersonalization.Color, body: CharacterPersonalization.Body }, frameI?: number): Promise<Buffer[]> => {
  const createdImages: Buffer[] = []

  let characterComponents = {
    'right-leg': color,
    'right-arm': color,
    'body': 'nothing',
    'left-leg': color,
    'tshirt': body !== 'nothing' ? body : undefined,
    'left-arm': color,
    'head': color,
  }

  for (let i = (frameI || 0); i < (frameI || 23) + 1; i++) {
    const iFormatted = i.toString().padStart(2, '0')

    const characterDirectoryPath = path.join(__dirname, '..', '..', 'res', 'character')

    const characterComponentsImages = Object.entries(characterComponents).map(([componentType, componentValue]) => {
      if (!componentValue) {
        return null
      }

      if (componentType === 'tshirt') {
        componentType = 'body'
      }

      return fs.readFileSync(path.join(characterDirectoryPath, componentType, componentValue, `${componentType}${iFormatted}.png`), 'base64')
    })

    const characterComponentsElements = await Promise.all(characterComponentsImages.filter(characterComponentsImage => characterComponentsImage !== null).map(img => canvas.loadImage(`data:image/png;base64,${img}`)))

    const canva = canvas.createCanvas(characterComponentsElements[0].width, characterComponentsElements[0].height)

    const ctx = canva.getContext('2d')
    characterComponentsElements.forEach(component => ctx.drawImage(component, 0, 0))

    createdImages.push(canva.toBuffer('image/png'))
  }

  return createdImages
}

export default generateCharacter
