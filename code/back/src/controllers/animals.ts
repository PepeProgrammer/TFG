import { Animal } from '../models/animals'
import { AnimalFilters, SearchFilters } from '../types'
import { Op } from 'sequelize'
import { getStatesFromCountry } from './states'

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

export const getFilteredAnimals = async (filters: SearchFilters): Promise<any[] | undefined> => {
  const where: any = {}
  const userWhere: any = {}

  if (filters.age !== undefined) {
    switch (filters.age) {
      case 'puppy':
        where.age = { [Op.between]: [0, 1] }
        break
      case 'young':
        where.age = { [Op.between]: [2, 3] }
        break
      case 'adult':
        where.age = { [Op.between]: [4, 99] }
        break
    }
  }

  if (filters.species !== undefined) {
    const species = filters.species.split(',') // transform the string list into an array
    where.species = { [Op.in]: species }
  }

  if (filters.states !== undefined) {
    const states = filters.states.split(',') // transform the string list into an array
    userWhere.state = { [Op.in]: states }
  }

  console.log(where)

  try {
    return await Animal.findAll({
      where,
      include: [
        {
          association: 'user',
          attributes: ['username', 'id', 'take_ins', 'sponsors', 'profile_image'],
          where: userWhere
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

export const getAnimalTypes = async (): Promise<any[] | undefined> => {
  try {
    return await Animal.findAll({
      attributes: ['species'],
      group: ['species']
    })
  } catch (error) {
    console.log(error)
  }
  return undefined
}

export const getAnimalFilters = async (country: number = 28): Promise<AnimalFilters | undefined> => {
  const states = await getStatesFromCountry(country)
  let animals = await getAnimalTypes()
  if (animals !== undefined) {
    animals = animals.map((animal: any) => animal.species)
  }

  return {
    states,
    animals
  }
}
