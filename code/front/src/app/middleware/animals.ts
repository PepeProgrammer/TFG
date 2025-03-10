import {Association, Image} from "../../types";
import {UserTypes} from "../../../variables";

export interface Animal {
  id: number
  name: string
  age: number
  species: string
  breed: string
  description: string
  images: Image[]
  createdAt: string
  updatedAt: string
  user: Association
  sponsored: boolean
  adopted: boolean
  takenIn: boolean
  information: {
    noParasite: boolean
    chip: boolean
    vaccinated: boolean
    sterilized: boolean
  }
}

export const createVoidAnimal = (): Animal => {
  return {
    id: 0,
    name: '',
    age: 0,
    species: '',
    breed: '',
    description: '',
    images: [],
    createdAt: '',
    updatedAt: '',
    user: {
      id: 0,
      username: '',
      take_ins: false,
      sponsors: false,
      profile_image: ''
    },
    sponsored: false,
    adopted: false,
    takenIn: false,
    information: {
      noParasite: false,
      chip: false,
      vaccinated: false,
      sterilized: false
    }
  }

}
