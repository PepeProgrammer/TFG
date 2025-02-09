import {inject, Injectable} from '@angular/core'
import {Geolocation} from "@capacitor/geolocation";
import * as opencage from 'opencage-api-client'
import {getBaseUrl} from "../../../dbInfo";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {castToCountry, castToLocation, castToStates} from "../parsers/location";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  API_KEY = 'e349b5eb58494eeaa27f2451832d9640'
  baseUrl: string = ""
  httpClient = inject(HttpClient)

  constructor() {
    this.baseUrl = getBaseUrl()
  }

  async getCurrentPosition() {

    const coordinates = await Geolocation.getCurrentPosition();

    return {latitude: coordinates.coords.latitude, longitude: coordinates.coords.longitude}
  }

  async getStateByCoordinates() {
    const coordinates = await this.getCurrentPosition()
    const direction = await opencage.geocode({key: this.API_KEY, q: `${coordinates.latitude},${coordinates.longitude}`})
    return direction.results[0].components.province
  }

  async getLocationInfo(state: string) {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }
    const location = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/countries?state=${state}`, options))
    console.log('LOCATION: ', location)
    return castToLocation(location)

  }

  async getCountries() {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }

    const countries = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/countries`, options))
    return castToCountry(countries)
  }

  async getStatesFromCountry(country: number) {
    const options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')
    }

    const states = await firstValueFrom(this.httpClient.get(`${this.baseUrl}/api/states/${country}`, options))
    return castToStates(states)
  }
}
