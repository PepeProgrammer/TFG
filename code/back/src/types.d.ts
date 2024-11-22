export interface SearchFilters {
  filter: boolean
  age?: string
  species?: string
  states?: string
}

export interface AnimalFilters {
  animals: string[] | undefined
  states: any[] | undefined
}
