import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Filter} from "../../types";
import {getBaseUrl, loggedUser} from "../../../variables";
import {castToSpecies, Species} from "../middleware/species";


@Injectable({
  providedIn: 'root'
})
export class AnimalsService {
  baseUrl: string = ""
    httpClient = inject(HttpClient)

  constructor() {
    this.baseUrl = getBaseUrl()
  }

  getAll(offset: number, range: number): Promise<any> {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/animals?offset=${offset}&range=${range}`, options))
  }

  getFilters(country: number): Promise<any> {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/filters/${country}`, options))
  }

  getAnimalByFilters(states: string, species: string, offset: number, range: number, age: string = '', lost = false, userId: number = -1): Promise<any> {
    const options: any = {
      withCredentials: true
    }
    let url = "filters=1"

    url += (states !== "") ? `&states=${states}` : ""
    url += (species !== "") ? `&species=${species}` : ""
    if (!lost) {
      url += (age !== "") ? `&age=${age}` : ""
      return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/animals?${url}&offset=${offset}&range=${range}&userId=${userId}`, options))
    } else {
      return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/lost?${url}&offset=${offset}&range=${range}`, options))
    }
  }

  async addAnimal(data: FormData, lost = false): Promise<any> {
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Content-Type', 'application/json')
    const options = {
      headers,
      withCredentials: true
    }

    if (!lost) {
      return firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/animals`, data, options))
    }
    return firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/lost`, data, options))
  }

  async getAllSpecies(): Promise<Species[]> {
    const species = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/species`))

    return castToSpecies(species as any)
  }
}
