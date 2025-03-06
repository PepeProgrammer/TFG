import {inject, Injectable} from '@angular/core';
import {getBaseUrl} from "../../../variables";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {castToUser, User} from "../middleware/users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl: string = ""
  httpClient = inject(HttpClient)

  constructor() {
    this.baseUrl = getBaseUrl()
  }

  checkUsernameEmail(username: string, email: string) {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/users?username=${username}&email=${email}&noReturn=0`, options))
  }

  async addUser(data: FormData) {
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Content-Type', 'application/json')
    const options = {
      headers: headers
    }

    const user: any = await firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/users?option=create`, data, options))
    if(user.id === undefined){
      return null
    }
    return castToUser(user)
  }

  async getUserLogged() {
    const options = {
      withCredentials: true
    }
    const user: any = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/users`, options))
    if(user.id === undefined){
      return null
    }
      return castToUser(user)
  }

  async updateUser(user: User) {
    const options = {
      withCredentials: true
    }
    const userResponse: any = await firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/users?option=update`, user, options))
    if(userResponse.id === undefined){
      return null
    }

    return castToUser(userResponse)
  }
}
