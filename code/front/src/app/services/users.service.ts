import {inject, Injectable} from '@angular/core';
import {getBaseUrl} from "../../../variables";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {castToUser, User, UserShelter} from "../middleware/users";

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
    return firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/users?username=${username}&email=${email}&option=check`, options))
  }

  async addUser(data: FormData) {
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Content-Type', 'application/json')
    const options = {
      headers: headers
    }

    const user: any = await firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/users?option=create`, data, options))
    if (user.id === undefined) {
      return null
    }
    return castToUser(user)
  }

  async getUserLogged() {
    const options = {
      withCredentials: true
    }
    const user: any = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/users?option=userData`, options))
    if (user.id === undefined) {
      return null
    }
    return castToUser(user)
  }

  async updateUser(user: User) {
    const options = {
      withCredentials: true
    }
    const userResponse: any = await firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/users?option=update`, user, options))
    if (userResponse.id === undefined) {
      return null
    }

    return castToUser(userResponse)
  }

  async getShelterUsers(filters: any = {}): Promise<UserShelter[]>{
    let data = ''
    const options = {
      withCredentials: true
    }
    if(filters.states !== undefined && filters.states.length > 0){
      data += `&states=${filters.states.join(',')}`

    }
    const users: any = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/users?option=shelters${data}`, options))
    return users.length > 0 ? users.map((user: any) => castToUser(user)) : []


  }

}
