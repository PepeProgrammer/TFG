import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {getBaseUrl, loggedUser, UserTypes} from "../../../variables";
import {UsersService} from "../services/users.service";
import {User} from "../middleware/users";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from "ngx-image-cropper";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Capacitor} from "@capacitor/core";
import {image} from "ionicons/icons";
import {Species} from "../middleware/species";
import {AnimalsService} from "../services/animals.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UsersService)
  animalService = inject(AnimalsService)
  baseUrl: string

  user: User | null = null
  shelterHomeStatusChanged = false
  editMode = false
  description: string = ''
  isToastOpen: boolean = false
  toastMessage: string = ""

  isMobile: boolean = Capacitor.getPlatform() !== 'web'

  // Variables relacionadas con las imágenes
  @ViewChild('cropper') cropper: ImageCropperComponent | undefined;
  MAX_IMAGES = 6
  notCropImage: string | undefined = ''
  isModalOpen: boolean = false
  croppedImage: SafeUrl = '';
  imageUrls: any[] = []
  currentSlot = -1
  speciesList: Species[] = []
  constructor(private router: Router, private sanitizer: DomSanitizer) {
    this.baseUrl = getBaseUrl()
    this.changeImages()
  }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.user = await this.userService.getUserLogged()
  }

  async logout() {
    loggedUser.setAuth(false)
    loggedUser.setType(UserTypes.NO_REGISTERED)
    await this.authenticationService.logout()
    await this.router.navigate(['/home'])
  }

  changeShelterHomeStatus() {
    this.shelterHomeStatusChanged = !this.shelterHomeStatusChanged
    if (this.user !== null) {
      this.user.shelterHome = !this.user.shelterHome
    }
  }

  changeTakeInsStatus() {
    if (this.user !== null) {
      this.user.take_ins = !this.user.take_ins
    }
  }

  changeSponsorsStatus() {
    if (this.user !== null) {
      this.user.sponsors = !this.user.sponsors
    }
  }

  async saveChanges() {
    if (this.user !== null) {
      if(this.user.type === UserTypes.ASSOCIATION){
        this.user.images = this.imageUrls
      }
      const user = await this.userService.updateUser(this.user)
      if (user !== null) {
        this.changeEditMode(false)
        this.user = user
        this.shelterHomeStatusChanged = false
        this.toastMessage = "updateSuccess"
        this.setOpen(true)
      }
    }
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

 async changeEditMode(mode: boolean) {
    this.editMode = mode
    if(this.speciesList.length === 0){
      this.speciesList = await this.animalService.getAllSpecies()
    }
    if (mode) {
      this.description = this.user?.description || ''
    } else {
      this.changeImages() // clean the images
      if(this.user !== null){
        this.user.description = this.description // restore previous description if user cancel the changes
      }
    }
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
      this.imageUrls[this.currentSlot] = this.cropper.crop('base64')?.base64
      this.notCropImage = ''; // reset the image
    }

    console.log(this.imageUrls)
  }

  cancelCrop() {
    this.notCropImage = ''
  }

  async addImageToSlot(slot: number) {
    this.currentSlot = slot

    if (Capacitor.isNativePlatform()) {
      this.isModalOpen = true
    } else {
      await this.selectImage()
    }
  }

  changeImages() {
    const urls = []
    for (let i = 0; i < this.MAX_IMAGES; i++) {
      urls.push('assets/images/addImage.png')
    }
    this.imageUrls = urls
  }

  protected readonly loggedUser = loggedUser;
  protected readonly UserTypes = UserTypes;
  protected readonly Capacitor = Capacitor;
}
