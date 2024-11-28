import {Component, inject, OnInit} from '@angular/core';
import {AnimalsService} from "../services/animals.service";
import {Association, Filter} from "../../types";
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  animalService = inject(AnimalsService)

  associations: Association[] = []
  filters: Filter | undefined

  selectedSpecies: string = ''
  selectedAge: string = ''
  selectedState: string = ''
  async ngOnInit() {
    this.filters = await this.animalService.getFilters(28) // TODO: found a way to get the country
    this.associations = await this.animalService.getAll()
  }

  async applyFilters() {
    if(this.selectedState !== '' || this.selectedAge !== '' || this.selectedSpecies !== '') {
      this.associations = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedAge, this.selectedSpecies)
    }
  }



}
