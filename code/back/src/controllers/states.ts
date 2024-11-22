import { State } from '../models/States'

export const getStatesFromCountry = async (country: number): Promise<any[] | undefined> => {
  try {
    return await State.findAll({
      where: { countryId: country },
      attributes: ['name', 'id'],
      order: ['name']
    })
  } catch (error) {
    console.log(error)
  }
  return undefined
}
