import {Component, inject, OnInit} from '@angular/core';
import {AnimalsService} from "../services/animals.service";
import {Animal, Association, Filter} from "../../types";
import {getBaseUrl} from "../../../dbInfo";
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  animalService = inject(AnimalsService)

  animals: Animal[] = []
  filters: Filter | undefined

  selectedSpecies: string = ''
  selectedAge: string = ''
  selectedState: string = ''

  baseUrl = getBaseUrl()
  async ngOnInit() {
    this.filters = await this.animalService.getFilters(28) // TODO: found a way to get the country
    this.animals = await this.animalService.getAll()
  }

  async applyFilters() {
    if(this.selectedState !== '' || this.selectedAge !== '' || this.selectedSpecies !== '') {
      this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedAge, this.selectedSpecies)
    }
  }



}
