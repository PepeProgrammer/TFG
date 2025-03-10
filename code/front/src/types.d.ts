import {FormControl} from "@angular/forms";

export interface Association {
  id: number,
  username: string,
  take_ins: boolean,
  sponsors:boolean,
  profile_image: string,
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


export interface LocationInfo {
  country: {id: number, name: string},
  state: {id: number, name: string, countryId: number},
  countries: {id: number, name: string}[]
  states: {id: number, name: string}[]
}

export interface Country {
  id: number,
  name: string
}

export interface State {
  id: number,
  name: string
}
