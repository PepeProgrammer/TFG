import {Component, inject, OnInit} from '@angular/core';
import {AnimalsService} from "../services/animals.service";
import {Filter} from "../../types";
import {getBaseUrl} from "../../../dbInfo";
import {InfiniteScrollCustomEvent} from "@ionic/angular";

@Component({
  selector: 'app-lost-animals',
  templateUrl: './lost-animals.page.html',
  styleUrls: ['./lost-animals.page.scss'],
})
export class LostAnimalsPage implements OnInit {

  animalService = inject(AnimalsService)

  filters: Filter | undefined
  animals: any  = []
  offset: number = 0
  range: number = 5

  selectedSpecies: string = ''
  selectedState: string = ''

  baseUrl = getBaseUrl()
  disableScroll: boolean = false
  constructor() { }

  async ngOnInit() {
    this.filters = await this.animalService.getFilters(28) // TODO: found a way to get the country
    this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, '', true)

    this.offset += this.range//con esto hago que la próxima vez busque los siguientes 5 animales

    console.log(this.animals)
  }

  async applyFilters() {
    if(this.selectedState !== '' || this.selectedSpecies !== '') {
      this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, '', true)
      this.offset += this.range
    }
  }

  async onIonInfinite(event: any) {
    const newAnimals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, '', true)
    if(newAnimals.length !== 0) {
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

}
