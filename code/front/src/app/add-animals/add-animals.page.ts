import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Filter} from "../../types";
import {AnimalsService} from "../services/animals.service";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-add-animals',
  templateUrl: './add-animals.page.html',
  styleUrls: ['./add-animals.page.scss'],
})
export class AddAnimalsPage implements OnInit {

  animalService = inject(AnimalsService)
  dataService = inject(DataService)

  imageUrls: {url: string, fileName: string}[] = []

  form: FormGroup
  formData = new FormData()
  species: Filter | undefined

  name = ""
  selectedSpecies = ""
  description = ""

  constructor() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      age: new FormControl('', [Validators.required]),
      species: new FormControl('', [Validators.required]),
      breed: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    })

  }

  async ngOnInit() {
    this.species = await this.animalService.getFilters(28)
  }


  async addImage() {
    const file = await this.dataService.pickImage()
    if (file.blob) {
      const rawFile = new File([file.blob], file.name, {
        type: file.mimeType,
      });
      this.formData.append(file.name, rawFile, file.name);
      this.imageUrls.push({url: URL.createObjectURL(rawFile), fileName: file.name})
    }
    console.log(file)
  }

  deleteImage(index: number) {
    this.formData.delete(this.imageUrls[index].fileName)
    this.imageUrls.splice(index, 1)
  }
}
