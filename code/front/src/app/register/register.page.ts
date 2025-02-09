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
import {GeolocationService} from "../services/geolocation.service";
import {LocationInfo} from "../../types";
import {PhotoService} from "../services/photo.service";
import {image} from "ionicons/icons";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('cropper') cropper: ImageCropperComponent | undefined;
  userService = inject(UsersService)
  geolocationService = inject(GeolocationService)
  photoService = inject(PhotoService)


  notCropImage: string | undefined;
  form: FormGroup
  imageUrl: string | null | undefined
  isModalOpen: boolean;
  isMobile: boolean = Capacitor.getPlatform() !== 'web'
  private croppedImage: SafeUrl | undefined;
  passText: string | undefined
  usernameText: string | undefined
  emailText: string | undefined
  isToastOpen: boolean = false
  toastMessage: string = ""
  locationInfo: LocationInfo
  formData = new FormData()


  constructor(private sanitizer: DomSanitizer) {
    this.locationInfo = {countries: [], country: {id: 0, name: ''}, state: {id: 0, name: '', countryId: 0}, states: []}
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)], this.checkPassword()),
      country: new FormControl(this.locationInfo.country.id, [Validators.required]),
      state: new FormControl(this.locationInfo.state.id, [Validators.required]),
      type: new FormControl('standard')
    })
    this.imageUrl = ''
    this.isModalOpen = false
  }

  async ngOnInit() {
    console.log("Register page")
    const state: string = await this.geolocationService.getStateByCoordinates()
    if(state !== '') {
      this.locationInfo = await this.geolocationService.getLocationInfo(state)
    } else {
      this.locationInfo.countries = await this.geolocationService.getCountries()
    }

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

  async checkUsernameAndEmail() {
    const username = this.form.value['username']
    const email = this.form.value['email']
    const response: any = await this.userService.checkUsernameEmail(username, email)
    let success = true
    console.log(response)
    if (response.username) { // Si ya existe un usuario con ese username
      this.usernameText = 'register.usernameTaken'
      success = false
    } else {
      this.usernameText = ''

    }

    if (response.email) { // Si ya existe un usuario con ese email
      this.emailText = 'register.emailTaken'
      success = false
    } else {
      this.emailText = ''
    }

    return success;
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  async addUser() {

    if (this.form.value["name"].trim().length < 3) {
      this.toastMessage = 'register.nameLength'
      this.isToastOpen = true
      return false
    } else if (this.form.value["lastname"].trim().length < 3) {
      this.toastMessage = 'register.lastnameLength'
      this.isToastOpen = true
      return false
    } else if (!this.validEmail(this.form.value["email"])) {
      this.toastMessage = 'register.emailInvalid'
      this.isToastOpen = true
      return false
    } else if (this.form.value['password'].length < 6) {
      this.toastMessage = 'register.passwordLength'
      this.isToastOpen = true
      return false
    } else if (this.form.value["username"].trim() === '' || this.form.value['country'] === '' || this.form.value['state'] === ''
      || this.form.value['password'] === '' || this.form.value['confirmPassword'] === '') {
      this.toastMessage = 'register.emptyFields'
      this.isToastOpen = true
      return false
    }


    if (!await this.checkUsernameAndEmail()) {
      return false
    }

    // Add user to database
    if(typeof this.imageUrl === 'string') {
      const file = this.photoService.dataURLtoFile([this.imageUrl], this.form.value['name'])
      if (file !== undefined) {
        this.formData.append('files', file)
      }
      this.addToFormData()


      return true
    }

    return false
  }

  protected readonly Capacitor = Capacitor;


  private validEmail(email: string) {
    const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    return regex.test(email);
  }

  async changeStates() {
    this.locationInfo.states = await this.geolocationService.getStatesFromCountry(this.form.value['country'])
  }

  addToFormData = () => {
    this.formData.append('name', this.form.value['name'].trim())
    this.formData.append('lastname', this.form.value['lastname'].trim())
    this.formData.append('email', this.form.value['email'].trim())
    this.formData.append('username', this.form.value['username'].trim())
    this.formData.append('password', this.form.value['password'])
    this.formData.append('country', this.form.value['country'])
    this.formData.append('state', this.form.value['state'])
    this.formData.append('type', this.form.value['type'])
  }
}
