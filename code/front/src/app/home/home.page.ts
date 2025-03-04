import {Component, inject, OnInit} from '@angular/core';
import {AnimalsService} from "../services/animals.service";
import {Animal, Association, Filter} from "../../types";
import {getBaseUrl, loggedUser, UserTypes} from "../../../variables";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {RequestsService} from "../services/requests.service";
import {RequestType} from "../middleware/requests";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  animalService = inject(AnimalsService)
  requestService = inject(RequestsService)

  animals: Animal[] = []
  filters: Filter | undefined

  selectedSpecies: string = ''
  selectedAge: string = ''
  selectedState: string = ''

  baseUrl = getBaseUrl()
  offset = 0
  range = 5

  disableScroll: boolean = false

  isToastOpen: boolean = false
  toastMessage: string = ""


  async ngOnInit() {
    this.filters = await this.animalService.getFilters(28) // TODO: found a way to get the country
    this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, this.selectedAge)

    this.offset += this.range//con esto hago que la próxima vez busque los siguientes 5 animales
  }

  async applyFilters() {
    console.log('Provincia: ', this.selectedState)
    if (this.selectedState !== '' || this.selectedAge !== '' || this.selectedSpecies !== '') {
      this.offset = 0
      this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, this.selectedAge)
      this.offset += this.range
    }
  }


  async onIonInfinite(event: any) {
    const newAnimals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, this.selectedAge)
    console.log(newAnimals)
    if (newAnimals.length !== 0) {
      this.animals.push(...newAnimals)
      this.offset += this.range
      setTimeout(() => {
        (event as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {
      this.disableScroll = true
    }

  }

  cleanOffset() {
    this.offset = 0
  }

  async sendRequest(animalId: number, type: number) {
    if (loggedUser.isAuth()) {
      const response = await this.requestService.addRequest({animalId, type})
      if (response) {
        this.toastMessage = "adoptionMessages.petitionSent"
      } else {
        this.toastMessage = "adoptionMessages.error"
      }
    } else {
      this.toastMessage = "noLogged"
    }
    this.setOpen(true);
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }


  protected readonly loggedUser = loggedUser;
  protected readonly UserTypes = UserTypes;
  protected readonly RequestType = RequestType;
}

//TODO: Quitar los márgenes de las páginas de visualización de animales tanto aquí como en lost-animals.page.ts
