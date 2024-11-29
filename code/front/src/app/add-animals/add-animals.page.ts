import {Component, inject, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Filter} from "../../types";
import {AnimalsService} from "../services/animals.service";

@Component({
  selector: 'app-add-animals',
  templateUrl: './add-animals.page.html',
  styleUrls: ['./add-animals.page.scss'],
})
export class AddAnimalsPage implements OnInit {

  animalService = inject(AnimalsService)

  form: FormGroup
  species: Filter | undefined

  name = ""
  selectedSpecies = ""
  description = ""

  constructor() {
    this.form = new FormGroup({})

  }

 async ngOnInit() {
    console.log("pepe")
    this.species = await this.animalService.getFilters(28)
  }

}
