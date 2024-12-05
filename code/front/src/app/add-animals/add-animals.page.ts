import {Component, inject, OnInit} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {Platform} from "@ionic/angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AnimalsService} from "../services/animals.service";
import {DataService} from "../services/data.service";
import {Filter} from "../../types";
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
  dataService = inject(DataService)

  imageUrls: any[] = []

  form: FormGroup
  formData = new FormData()
  species: Filter | undefined

  name = ""
  selectedSpecies = ""
  description = ""

  constructor(private platform: Platform) {
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




  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    })

    console.log(image);
    if(image) {
      //this.saveImage(image)
      console.log(image.path)

      // const image64 = await this.readAsBase64(image)
      // console.log(image64)
      this.imageUrls.push(image.dataUrl)
    }

  }

  async saveImage(photo: Photo) {

    const base64Data = await this.readAsBase64(photo)

    console.log(base64Data)

    const fileName = new Date().getTime() + '.jpeg'
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `photos/${fileName}`,
      data: base64Data
    })

  }

  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) { //android o ios
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
