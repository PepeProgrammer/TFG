import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {AnimalsService} from "../services/animals.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Filter} from "../../types";
import {Router} from "@angular/router";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {Capacitor} from "@capacitor/core";
import 'hammerjs'
import {ImageCropperComponent, ImageCroppedEvent, LoadedImage} from 'ngx-image-cropper';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-add-lost-animals',
  templateUrl: './add-lost-animals.page.html',
  styleUrls: ['./add-lost-animals.page.scss'],
})
export class AddLostAnimalsPage implements OnInit {

  @ViewChild('cropper') cropper: ImageCropperComponent | undefined;
  animalService = inject(AnimalsService)

  imageUrls: any[] = []

  form: FormGroup
  formData = new FormData()
  filters: Filter | undefined

  isToastOpen: boolean = false
  isModalOpen: boolean = false
  toastMessage: string = ""

  croppedImage: SafeUrl = '';

  isMobile: boolean = Capacitor.getPlatform() !== 'web'
  notCropImage: string | undefined = ""
  constructor(private router: Router, private sanitizer: DomSanitizer) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      postType: new FormControl('lost', [Validators.required]),
      species: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required, Validators.minLength(1)]),
      place: new FormControl('', [Validators.required, Validators.minLength(1)]),
      images: new FormControl([]),
      description: new FormControl('', [Validators.required, Validators.minLength(1)]),
      userId: new FormControl(1) //TODO: cambiar por la asociación del usuario
    })
  }

  async ngOnInit() {
    this.filters = await this.animalService.getFilters(28)
    console.log(this.filters)
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
      this.notCropImage = image.dataUrl
      //this.imageUrls.push(image.dataUrl)
    }

    this.isModalOpen = false
  }

  async addAnimal() {

    if (this.form.value['name'].trim() === "" || this.form.value['filters'] === "" || this.form.value['description'].trim() === ""
      || this.form.value['postType'] === "" || this.form.value['state'] === "" || this.form.value['city'].trim() === "" || this.form.value['place'].trim() === "") {
      this.toastMessage = "formValidators.allRequired"
      this.setOpen(true)
    } else if (this.imageUrls.length === 0) {
      this.toastMessage = "adoptionMessages.minImages"
      this.setOpen(true)
    } else {

      this.dataURLtoFile(this.imageUrls, this.form.value['name'])
      this.addToFormData()

      const response = await this.animalService.addAnimal(this.formData, true)
      this.formData = new FormData() // con esto evitamos la duplicidad en los campos en caso de que haya sucedido un error en la subida de adopción

      if (response.success) {
        console.log(response)
        await this.router.navigate(['/lost-animals'])
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
    this.formData.append('postType', this.form.value['postType'])
    this.formData.append('species', this.form.value['species'])
    this.formData.append('state', this.form.value['state'])
    this.formData.append('city', this.form.value['city'].trim())
    this.formData.append('place', this.form.value['place'].trim())
    this.formData.append('description', this.form.value['description'].trim())
    this.formData.append('userId', this.form.value['userId'])
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
