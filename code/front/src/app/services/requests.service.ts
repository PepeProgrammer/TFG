import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {getBaseUrl} from "../../../variables";
import {firstValueFrom} from "rxjs";
import {castToRequests} from "../middleware/requests";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  baseUrl: string = ""
  httpClient = inject(HttpClient)

  constructor() {
    this.baseUrl = getBaseUrl()
  }

  async getRequests() {
    const options = {
      withCredentials: true
    }
    const requests: any = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/requests`, options))
    return castToRequests(requests)
  }

  async addRequest(data: {animalId: number, requestedId: number, type: number}) {
    const options = {
      withCredentials: true
    }
    const response: any = await firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/requests`, data, options))
    return response.success
  }

  async deleteRequest(id: number) {
    const options = {
      withCredentials: true
    }
    const response: any = await firstValueFrom(this.httpClient.delete(`${this.baseUrl}/api/requests/${id}`, options))
  }
}
