import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AnimalsService} from "../services/animals.service";
import {Filter} from "../../types";
import {Router} from "@angular/router";
import {Capacitor} from "@capacitor/core";
import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from "ngx-image-cropper";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {PhotoService} from "../services/photo.service";

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
  @ViewChild('cropper') cropper: ImageCropperComponent | undefined;

  animalService = inject(AnimalsService)
  photoService = inject(PhotoService)

  imageUrls: any[] = []

  form: FormGroup
  formData = new FormData()
  species: Filter | undefined

  isToastOpen: boolean = false
  isModalOpen: boolean = false
  toastMessage: string = ""

  croppedImage: SafeUrl = '';

  isMobile: boolean = Capacitor.getPlatform() !== 'web'
  notCropImage: string | undefined = ""

  constructor(private router: Router, private sanitizer: DomSanitizer) {
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
    this.species = await this.animalService.getFilters(28) //TODO: hacer que solo se traiga el filtro de especies y no el de estados
  }


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
      // this.imageUrls.push(image.dataUrl)
      this.notCropImage = image.dataUrl

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


      const file = this.photoService.dataURLtoFile(this.imageUrls, this.form.value['name'])
      if (file !== undefined) {
        this.formData.append('files', file)
      }
      this.addToFormData()

      const response = await this.animalService.addAnimal(this.formData)
      this.formData = new FormData() // con esto evitamos la duplicidad en los campos en caso de que haya sucedido un error en la subida de adopción

      if (response.success) {
        await this.router.navigate(['/home'])
      } else {
        this.toastMessage = "adoptionMessages.error"
        this.setOpen(true);
      }
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

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl != null) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
    // event.blob can be used to upload the cropped image
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    console.log('Image load failed');
  }

  cropImage() {
    if (this.cropper != null) {
      const croppedImage = this.cropper.crop('base64')?.base64
      this.imageUrls.push(croppedImage)
      this.notCropImage = '' // reset the image
    }
  }

  cancelCrop() {
    this.notCropImage = ''
  }

  protected readonly Capacitor = Capacitor;
}




