import { Animal } from '../models/animals'

export const getAllAnimals = async (): Promise<any[] | undefined> => {
  try {
    return await Animal.findAll({
      include: [
        {
          association: 'user',
          attributes: ['username', 'id', 'take_ins', 'sponsors', 'profile_image']
        },
        {
          association: 'images',
          attributes: ['url']
        }
      ]
    })
  } catch (error) {
    console.log(error)
  }
  return undefined
}
