
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
  shelterHome: boolean
}

export interface UserShelter extends Pick<User, 'id' | 'username' | 'profile_image'>{}
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
    shelterHome: data.shelterHome
  }
}

export const castToUserShelter = (data: any): UserShelter => {
  return {
    id: data.id,
    username: data.username,
    profile_image: data.profile_image
  }
}
