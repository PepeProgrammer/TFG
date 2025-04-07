import {Component, inject, OnInit} from '@angular/core';
import {AnimalsService} from "../services/animals.service";
import {Filter} from "../../types";
import {getBaseUrl, selected} from "../../../variables";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {Router} from "@angular/router";

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
  range: number = 8

  selectedSpecies: string = ''
  selectedState: string = ''

  baseUrl = getBaseUrl()
  disableScroll: boolean = false
  constructor(private router: Router) { }

  async ngOnInit() {
    const city = await this.animalService.getCountryCode()
    this.filters = await this.animalService.getFilters(city) 
  }

  async ionViewWillEnter() {
    this.animals = []
    this.offset = 0
    this.disableScroll = false
    console.log('entra', this.offset)

    this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, '', true)
    this.offset += this.range//con esto hago que la próxima vez busque los siguientes 5 animales
  }

  async applyFilters() {
    if(this.selectedState !== '' || this.selectedSpecies !== '') {
      this.offset = 0
      this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, '', true)
      this.offset += this.range
    }
  }

  async onIonInfinite(event: any) {
    const newAnimals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, '', true)
    console.log('nuevos:', newAnimals)
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
  async goToProfile(username: string) {
    console.log('go tooo')
    selected.userUsername = username
    await this.router.navigate(['/profile'])

  }
}
