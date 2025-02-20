export interface Species {
  id: number
  name: string
}

export function castToSpecies(data: any[]): Species[] {
  const species: Species[] = []
  for (const specie of data) {
    species.push({
      id: specie.id,
      name: specie.name
    })
  }
  return species
}
