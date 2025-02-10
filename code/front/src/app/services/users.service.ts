import {inject, Injectable} from '@angular/core';
import {getBaseUrl} from "../../../dbInfo";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {castToUser} from "../middleware/users";

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

    const user = await firstValueFrom(this.httpClient.post(`${this.baseUrl}/api/users`, data, options))
    return castToUser(user)
  }
}
