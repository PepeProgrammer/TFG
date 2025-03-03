
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
    state: data.state
  }
}
