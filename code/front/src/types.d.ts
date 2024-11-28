export interface Association {
  id: number,
  username: string,
  take_ins: boolean,
  sponsors:boolean,
  profile_image: string,
  animals: Animal[]
}

export interface Animal {
  id: number,
  name: string,
  age: number,
  species: string,
  breed: string,
  description: string,
  images: Image[],
  createdAt: string,
  updatedAt: string
}

interface Image {
  url: string
}

export interface Filter {
  species: Species[],
  states: State[]
}


interface Species {
  id: number,
  name: string
}

interface State {
  id: number,
  name: string
}
