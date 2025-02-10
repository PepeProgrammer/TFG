import {Country, LocationInfo, State} from "../../types";


export function castToLocation(data: any) {
  const location: LocationInfo = {
    country: data.country,
    state: data.state,
    countries: data.countries,
    states: data.states
  }

  return location
}

export function castToCountry(data: any) {
  return data as Country[]
}

export function castToStates(data: any) {
  return data as State[]
}
