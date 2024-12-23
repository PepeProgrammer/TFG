import {Component, inject, OnInit} from '@angular/core';
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AnimalsService} from "../services/animals.service";
import {Filter} from "../../types";
import {Router} from "@angular/router";
import {Capacitor} from "@capacitor/core";

interface LocalFile {
  name: string
  path: string
  data: string
}

@Component({
  selector: 'app-add-animals',
  templateUrl: './add-animals.page.html',
  styleUrls: ['./add-animals.page.scss'],
})


export class AddAnimalsPage implements OnInit {

  animalService = inject(AnimalsService)

  imageUrls: any[] = []

  form: FormGroup
  formData = new FormData()
  species: Filter | undefined

  isToastOpen: boolean = false
  isModalOpen: boolean = false
  toastMessage: string = ""

  constructor(private router: Router) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      age: new FormControl('', [Validators.required, Validators.min(0)]),
      species: new FormControl('', [Validators.required]),
      breed: new FormControl('', [Validators.required]),
      images: new FormControl([]),
      description: new FormControl(''),
      noParasite: new FormControl(false),
      chip: new FormControl(false),
      vaccinated: new FormControl(false),
      sterilized: new FormControl(false),
      associationId: new FormControl(1) //TODO: cambiar por la asociación del usuario
    })
  }

  async ngOnInit() {
    this.species = await this.animalService.getFilters(28)
  }


  // async addImage() {
  //   const file = await this.dataService.pickImage()
  //   if (file.blob) {
  //     const rawFile = new File([file.blob], file.name, {
  //       type: file.mimeType,
  //     });
  //     this.formData.append(file.name, rawFile, file.name);
  //     this.imageUrls.push({url: URL.createObjectURL(rawFile), fileName: file.name})
  //   }
  //   console.log(file)
  // }

  deleteImage(index: number) {
    this.imageUrls.splice(index, 1)
  }


  async selectImage(mode: string = 'gallery') {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: mode === 'gallery' ? CameraSource.Photos : CameraSource.Camera
    })

    if (image) {
      this.imageUrls.push(image.dataUrl)
    }

    this.isModalOpen = false
  }

  async addAnimal() {

    if (this.form.value['name'] === "" || this.form.value['age'] === "" || this.form.value['species'] === "" || this.form.value['description'] === "") {
      this.toastMessage = "adoptionMessages.fill"
      this.setOpen(true);
    } else if (this.form.value['age'] < 0 || this.form.value['age'] === "") {
      this.toastMessage = "adoptionMessages.minAge"
      this.setOpen(true);
    } else if (this.imageUrls.length === 0) {
      this.toastMessage = "adoptionMessages.minImages"
      this.setOpen(true);
    } else {

      if (this.form.value['breed'] === "") {
        this.form.value['breed'] = "unknown"
      }

      this.dataURLtoFile(this.imageUrls, this.form.value['name'])
      this.addToFormData()

      const response = await this.animalService.addAnimal(this.formData)
      this.formData = new FormData() // con esto evitamos la duplicidad en los campos en caso de que haya sucedido un error en la subida de adopción

      if (response.success) {
        this.router.navigate(['/home'])
      } else {
        this.toastMessage = "adoptionMessages.error"
        this.setOpen(true);
      }
    }


  }


  dataURLtoFile = (images: string[], animalName: string) => {
    const files: File[] = []
    for (const image of images) {
      const arr = image.split(',')

      // @ts-ignore
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1)
        n -= 1 // to make eslint happy
      }
      this.formData.append('files', new File([u8arr], `${new Date().getTime()}_${animalName}.jpg`, {type: mime}))
    }

  }

  addToFormData = () => {
    this.formData.append('name', this.form.value['name'].trim())
    this.formData.append('age', this.form.value['age'])
    this.formData.append('species', this.form.value['species'])
    this.formData.append('breed', this.form.value['breed'].trim())
    this.formData.append('description', this.form.value['description'].trim())
    this.formData.append('noParasite', this.form.value['noParasite'])
    this.formData.append('chip', this.form.value['chip'])
    this.formData.append('vaccinated', this.form.value['vaccinated'])
    this.formData.append('sterilized', this.form.value['sterilized'])
    this.formData.append('associationId', this.form.value['associationId'])
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  protected readonly Capacitor = Capacitor;
}




