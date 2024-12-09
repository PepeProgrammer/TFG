import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Filter} from "../../types";
import {getBaseUrl} from "../../../dbInfo";



@Injectable({
  providedIn: 'root'
})
export class AnimalsService {
  baseUrl: string = ""
  httpClient = inject(HttpClient)

  constructor() {
    this.baseUrl = getBaseUrl()
  }

  getAll(): Promise<any> {
    console.log(this.baseUrl)
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/animals`, options))
  }

  getFilters(country: number): Promise<any> {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/filters/${country}`, options))
  }

  getAnimalByFilters(states: string, age: string, species: string): Promise<any> {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    let url = "filters=1"

    url += (states !== "") ? `&states=${states}` : ""
    url += (age !== "") ? `&age=${age}` : ""
    url += (species !== "") ? `&species=${species}` : ""
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/animals?${url}`, options))
  }

  async addAnimal(data: FormData): Promise<any> {
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Content-Type', 'application/json')
    const options = {
      headers: headers
    }

    return firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/animals`, data, options))
  }
}
