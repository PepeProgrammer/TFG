import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Capacitor} from "@capacitor/core";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from "ngx-image-cropper";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Observable, of} from "rxjs";
import {UsersService} from "../services/users.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('cropper') cropper: ImageCropperComponent | undefined;
  userService = inject(UsersService)
  notCropImage: string | undefined;
  form: FormGroup
  imageUrl: string | null | undefined
  isModalOpen: boolean;
  isMobile: boolean = Capacitor.getPlatform() !== 'web'
  private croppedImage: SafeUrl | undefined;
  passText: string | undefined
  usernameText: string | undefined

  constructor(private sanitizer: DomSanitizer) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)], this.checkPassword()),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required])
    })
    this.imageUrl = ''
    this.isModalOpen = false
  }

  ngOnInit() {
    console.log("Register page")
  }

  deleteImage() {
    this.imageUrl = ''
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
      this.imageUrl = croppedImage
      this.notCropImage = '' // reset the image
    }
  }

  cancelCrop() {
    this.notCropImage = ''
  }

  checkPassword(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const passConfirm = control.value

      const pass = this.form.value['password']
      if (pass !== passConfirm) {
        this.passText = 'register.noMatch'
        return of({notSamePass: true})
      }
      this.passText = ''
      return of(null)

    }
  }

  async checkUsername() {
    const username = this.form.value['username']

    const response: any = await this.userService.getByUsername(username)
    console.log(response)
    if (!response.success) {
      this.usernameText = 'register.usernameTaken'
      return true
    }
    this.usernameText = ''
    return false;
  }

  protected readonly Capacitor = Capacitor;
}
