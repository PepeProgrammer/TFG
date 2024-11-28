import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Filter} from "../../types";
import {getBaseUrl} from "../../../dbInfo";


@Injectable({
  providedIn: 'root'
})
export class AnimalsService {
  baseUrl: string = getBaseUrl()
  httpClient = inject(HttpClient)
  getAll(): Promise<any> {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/associations/animals`, options))
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
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/associations/animals?${url}`, options))


  }
}
