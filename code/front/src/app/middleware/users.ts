import {Image} from "../../types";

export interface User {
  id: number,
  name: string,
  lastname: string,
  email: string,
  username: string,
  type: string,
  profile_image: string,
  take_ins?: boolean,
  sponsors?: boolean,
  state: number,
  description: string,
  shelterHome: boolean,
  images?: File[],
  serverImages?: Image[]
  species?: [{
    id: number,
    name: string,
    AsoSpecie: {
      toAdopt: boolean
      toShelter: boolean
    }
  }]
}

export interface UserShelter extends Pick<User, 'id' | 'username' | 'profile_image'>{
  state: {
    name: string
  }
}
export const castToUser = (data: any): User => {

  return {
    id: data.id,
    name: data.name,
    lastname: data.lastname,
    email: data.email,
    username: data.username,
    type: data.type,
    profile_image: data.profile_image,
    take_ins: data.take_ins,
    sponsors: data.sponsors,
    state: data.state,
    description: data.description,
    shelterHome: data.shelterHome,
    serverImages: data.serverImages !== undefined ? data.serverImages : [],
    species: data.species !== undefined ? data.species : []
  }
}

export const castToUserShelter = (data: any): UserShelter => {
  return {
    id: data.id,
    username: data.username,
    profile_image: data.profile_image,
    state: {
      name: data.state
    }
  }
}
