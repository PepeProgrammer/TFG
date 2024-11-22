import {Component, inject, OnInit} from '@angular/core';
import {AnimalsService} from "../services/animals.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  animalService = inject(AnimalsService)

  animals: any = []
  filters: any = []

  selectedSpecies: string = ''
  selectedAge: string = ''
  selectedState: string = ''
  async ngOnInit() {
    this.filters = await this.animalService.getFilters(28) // TODO: found a way to get the country
    this.animals = await this.animalService.getAll()
  }

  async applyFilters() {
    console.log(`QUE PASA: ${this.selectedState}`)
    console.log()
    if(this.selectedState !== '' || this.selectedAge !== '' || this.selectedSpecies !== '') {
      this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedAge, this.selectedSpecies)
    }
  }



}
