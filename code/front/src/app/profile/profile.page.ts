import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {getBaseUrl, loggedUser, selected, UserTypes} from "../../../variables";
import {UsersService} from "../services/users.service";
import {User} from "../middleware/users";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from "ngx-image-cropper";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Capacitor} from "@capacitor/core";
import {image, images} from "ionicons/icons";
import {Species} from "../middleware/species";
import {AnimalsService} from "../services/animals.service";
import {PhotoService} from "../services/photo.service";
import {Image} from "../../types";
import {RequestType} from "../middleware/request";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {Animal} from "../middleware/animals";
import {RequestsService} from "../services/requests.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UsersService)
  animalService = inject(AnimalsService)
  photoService = inject(PhotoService)
  requestService = inject(RequestsService)
  baseUrl: string

  user: User | null = null
  shelterHomeStatusChanged = false
  editMode = false
  description: string = ''
  isToastOpen: boolean = false
  toastMessage: string = ""

  isMobile: boolean = Capacitor.getPlatform() !== 'web'

  selectedAdoptions: string[] = []
  selectedShelters: string[] = []
  // Variables relacionadas con las imágenes
  @ViewChild('cropper') cropper: ImageCropperComponent | undefined;
  MAX_IMAGES = 6
  notCropImage: string | undefined = ''
  isModalOpen: boolean = false
  croppedImage: SafeUrl = '';
  imageUrls: Image[] = [] // Lista para mostrar las imágenes en los espacios asignados
  imagesList: any[] = [] // Lista para transformar las imágenes a formato de archivo
  deletedImages: number[] = [] // Lista para guardar las imágenes eliminadas
  currentSlot = -1
  speciesList: Species[] = []

  // Visualización de animales de asociación
  animals: Animal[] = []
  offset = 0
  range = 8
  disableScroll = false

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    this.baseUrl = getBaseUrl()
  }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    if(loggedUser.getUsername() === selected.userUsername){ // Por si el usuario decide pulsar en un post suyo y entrar en su propio perfil, así lo podrá editar
      selected.userUsername = ''
    }

    this.user = await this.userService.getUserLogged(selected.userUsername)
    console.log(this.user?.username)
    console.log(loggedUser.getUsername())
    console.log(loggedUser.getUsername() === this.user?.username)
    if(this.user?.type === UserTypes.ASSOCIATION && this.user.username !== loggedUser.getUsername()){
      console.log('en el perfil estoy')
      this.offset = 0
      this.animals = await this.animalService.getAnimalByFilters('', '', this.offset, this.range, '', false, this.user.id)
      this.offset += this.range//con esto hago que la próxima vez busque los siguientes 5 animales
    }

    this.updateFields()

  }

  ionViewWillLeave() {
    this.user = null
    this.updateFields()
  }

  updateFields() {
    this.imagesList = []
    this.imageUrls = []
    this.deletedImages = []
    this.changeImages()
    this.updateSelectors()
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
      const formData = new FormData()

      if(this.user.type === UserTypes.ASSOCIATION && this.imageUrls.length > 0) {
        const files = this.photoService.dataURLtoFile(this.imagesList, this.user.username)
        for (let i = 0; i < files.length; i++) {
          formData.append(`images${i}`, files[i])
        }
        if (this.deletedImages.length > 0) {
          formData.append('deletedImages', JSON.stringify(this.deletedImages))
        }

        for (const selectedAdopt of this.selectedAdoptions) {
          let exists = false
          for (const species of this.user.species || []) {
            if(species.id === Number(selectedAdopt)){
              exists = true
              break
            }
          }
          if(!exists){
            this.user.species?.push({id: Number(selectedAdopt), name: '', AsoSpecie: {toAdopt: true, toShelter: false}})
          }
        }

        for (const selectedShelter of this.selectedShelters) {
          let exists = false
          for (const species of this.user.species || []) {
            if(species.id === Number(selectedShelter)){
              exists = true
              break
            }
          }
          if(!exists){
            this.user.species?.push({id: Number(selectedShelter), name: '', AsoSpecie: {toAdopt: false, toShelter: true}})
          }
        }
        for (const species of this.user.species || []) { // Actualizar las especies seleccionadas
          species.AsoSpecie.toAdopt = this.selectedAdoptions.includes(String(species.id));
          species.AsoSpecie.toShelter = this.selectedShelters.includes(String(species.id));
        }

      }
      formData.append('user', JSON.stringify(this.user))

      const user = await this.userService.updateUser(formData)
      if (user !== null) {
        await this.changeEditMode(false)
        this.user = user
        this.changeImages()
        this.updateSelectors()
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
      if(this.imageUrls[this.currentSlot].id !== -1) { // Saber que imágenes van a ser eliminadas de la base de datos
        this.deletedImages.push(this.imageUrls[this.currentSlot].id as number)
      }
      this.imageUrls[this.currentSlot] = {url: this.cropper.crop('base64')?.base64 as string, id: -1}
      this.imagesList.push(this.cropper.crop('base64')?.base64)
      this.notCropImage = ''; // reset the image
    }

  }

  cancelCrop() {
    this.notCropImage = ''
  }

  async addImageToSlot(slot: number) {
    if(this.editMode){
      this.currentSlot = slot

      if (Capacitor.isNativePlatform()) {
        this.isModalOpen = true
      } else {
        await this.selectImage()
      }
    }

  }

  changeImages() {
    this.imageUrls = []
    const urls = []
    for(const image of this.user?.serverImages || []){
      urls.push({id: image.id, url: `${this.baseUrl}/uploads/images/associations/${image.url}`})
    }
    const numImages = this.user?.serverImages?.length || 0
    for (let i = 0; i < this.MAX_IMAGES - numImages; i++) {
      urls.push({id:-1, url: 'assets/images/addImage.png'})
    }
    this.imageUrls = urls
  }

  updateSelectors() {
    this.selectedAdoptions = []
    this.selectedShelters = []
    for (const species of this.user?.species || []) {
      if(species.AsoSpecie.toAdopt){
        this.selectedAdoptions.push(String(species.id))
      }
      if(species.AsoSpecie.toShelter){
        this.selectedShelters.push(String(species.id))
      }
    }
  }


  async onIonInfinite(event: any) {
    const newAnimals = await this.animalService.getAnimalByFilters('', '', this.offset, this.range, '', false, this.user !== null ? this.user.id : -1)
    if (newAnimals.length !== 0) {
      this.animals.push(...newAnimals)
      this.offset += this.range
      setTimeout(() => {
        (event as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {
      this.disableScroll = true
    }

  }


  async sendRequest(animalId: number, requestedId: number, type: number) {
    if (loggedUser.isAuth()) {
      const response = await this.requestService.addRequest({animalId, requestedId, type})
      if (response) {
        this.toastMessage = "adoptionMessages.petitionSent"
      } else {
        this.toastMessage = "adoptionMessages.error"
      }
    } else {
      this.toastMessage = "noLogged"
    }
    this.isModalOpen = false
    this.setOpen(true);
  }



  protected readonly loggedUser = loggedUser;
  protected readonly UserTypes = UserTypes;
  protected readonly Capacitor = Capacitor;
  protected readonly console = console;
  protected readonly selectedUser = selected;
  protected readonly RequestType = RequestType;
}
