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
import {Router} from "@angular/router";
import {loggedUser} from "../../../variables";
import {AnimalsService} from "../services/animals.service";
import {Species} from "../middleware/species";
import {AuthenticationService} from "../services/authentication.service";

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
  animalService = inject(AnimalsService)
  authService = inject(AuthenticationService)

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

  userType: 'standard' | 'association' = 'standard'
  speciesList: Species[] = []
  constructor(private sanitizer: DomSanitizer, private router: Router) {
    this.locationInfo = {countries: [], country: {id: 0, name: ''}, state: {id: 0, name: '', countryId: 0}, states: []}
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)], this.checkPassword()),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      type: new FormControl('standard'),
      species: new FormControl(''),
    })
    this.imageUrl = ''
    this.isModalOpen = false


  }

  async ngOnInit() {
    this.locationInfo = await this.geolocationService.fillLocationData(this.locationInfo)
    if (this.locationInfo.state.id !== 0) { // Si se ha podido obtener la ubicación actual del usuario
      this.form.setControl('country', new FormControl(this.locationInfo.country.id, [Validators.required]))
      this.form.setControl('state', new FormControl(this.locationInfo.state.id, [Validators.required])) // Con setControl sustituimos el control que ya existía por uno nuevo para que al enviar la provincia en// caso de que no se modifique la de la ubicación actual no de error
    }
    this.speciesList = await this.animalService.getAllSpecies()
    if(loggedUser.isAuth()){
      await this.router.navigate(['/home'])
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
    let files: File[] = []
    if (this.form.value["name"].trim().length < 3) {
      this.toastMessage = 'register.nameLength'
      this.isToastOpen = true
      return false
    } else if (this.form.value["lastname"].trim().length < 3 && this.userType === 'standard') {
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
    } else if (this.hasWhiteSpace(this.form.value["username"].trim())) {
      this.toastMessage = 'register.usernameWhiteSpace'
      this.isToastOpen = true
      return false
    } else if (this.userType === 'association' && (document.getElementById("foundedAct") as any).files[0] === undefined) {
      this.toastMessage = 'register.missingAct'
      this.isToastOpen = true
      return false
    }
    if (this.userType === 'association') {
      // files.push((document.getElementById("foundedAct") as any).files[0])
      this.formData.append('files[]', (document.getElementById("foundedAct") as any).files[0])
    }
    const checkTest = await this.checkUsernameAndEmail()
    if (!checkTest) {
      return false
    }

    // Add user to database
    if (typeof this.imageUrl === 'string' && this.imageUrl !== '') {
      const file = this.photoService.dataURLtoFile([this.imageUrl], this.form.value['name'])
      if (file !== undefined) {
        // files.push(file)
        this.formData.append('files[]', file[0])
      }
    }
    this.addToFormData()
    const user = await this.userService.addUser(this.formData)
    this.formData = new FormData() //Reiniciamos el form data para evitar duplicidad si le volvemos a dar al botón de registro

    if (user) {
      await this.authService.saveLoggedUser()
      await this.router.navigate(['/home'])
      return true

    } else {
      this.toastMessage = 'error'
      this.isToastOpen = true
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
    if (this.userType === 'association') {
      this.formData.append('fondedAct', this.form.value['fondedAct'])
    }
    this.formData.append('name', this.form.value['name'].trim())
    this.formData.append('lastname', this.form.value['lastname'].trim())
    this.formData.append('email', this.form.value['email'].trim())
    this.formData.append('username', this.form.value['username'].trim())
    this.formData.append('password', this.form.value['password'])
    this.formData.append('state', this.form.value['state'])
    this.formData.append('type', this.form.value['type'])
    this.formData.append('species', this.form.value['species'])
  }

  changeUserType() {
    this.userType = (document.getElementById('userType') as any).value
  }

  hasWhiteSpace(s: string) {
    return s.indexOf(' ') >= 0;
  }


}
