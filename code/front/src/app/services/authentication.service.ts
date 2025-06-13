import {inject, Injectable} from '@angular/core';
import {getBaseUrl, loggedUser} from "../../../variables";
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
    const options = {
      withCredentials: true
    }
    return firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/login`, {username, password}, options))

  }

  async isSessionValid() {
    const options = {
      withCredentials: true,
      // headers
    }
    const session: any =  await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/login`, options))
    return session


  }

  async logout() {
    const options = {
      withCredentials: true
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/logout`, options))
  }

  async saveLoggedUser() {
    const loggedData = await this.isSessionValid()
    loggedUser.setAuth(loggedData.isSessionEnabled)
    loggedUser.setType(loggedData.type)
    loggedUser.setUsername(loggedData.username)
  }
}
