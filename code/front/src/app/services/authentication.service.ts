import {inject, Injectable} from '@angular/core';
import {getBaseUrl} from "../../../variables";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string
  httpClient = inject(HttpClient)
  constructor() {
    this.baseUrl = getBaseUrl()
  }

  login(username: string, password: string) {
    console.log(this.baseUrl)
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    return firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/login`, {username, password}, options))
  }

  async isSessionValid() {
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('credentials', 'include')
    const options = {
      headers: headers,
      withCredentials: true
    }
    const session: any =  await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/login`, options))
    return session
  }
}
