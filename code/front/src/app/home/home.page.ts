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

  async ngOnInit() {
    console.log('RESPUESTA')
    const response = await this.animalService.getAll()
    console.log(response)
    this.animals = response
  }

}
