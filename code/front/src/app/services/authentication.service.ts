import {inject, Injectable} from '@angular/core';
import {getBaseUrl} from "../../../variables";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {CapacitorCookies, CapacitorHttp, HttpOptions, HttpResponse} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string
  httpClient = inject(HttpClient)
  constructor() {
    this.baseUrl = getBaseUrl()
  }

  async login(username: string, password: string) {
    console.log(this.baseUrl)
    const options = {
      withCredentials: true
    }
    return firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/login`, {username, password}, options))

  }

  async isSessionValid() {
    // headers.set('credentials', 'include')
    console.log("headers", this.baseUrl)
    // console.log(await CapacitorCookies.getCookies({url: this.baseUrl}))
    // const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    const options = {
      withCredentials: true,
      // headers
    }
    console.log('LA RUTA', `${this.baseUrl}/api/login`)
    const session: any =  await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/login`, options))
    return session


  }

  async logout() {
    const options = {
      withCredentials: true
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/logout`, options))
  }
}
