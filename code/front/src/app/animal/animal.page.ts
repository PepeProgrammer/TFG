import {Component, inject, OnInit} from '@angular/core';
import {getBaseUrl, loggedUser, selected, UserTypes} from "../../../variables";
import {Router} from "@angular/router";
import {Animal, createVoidAnimal} from "../middleware/animals";
import {RequestsService} from "../services/requests.service";
import {RequestType} from "../middleware/request";

@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

  requestService = inject(RequestsService)
  animal: Animal = createVoidAnimal()
  baseUrl = getBaseUrl()

  isToastOpen: boolean = false
  toastMessage: string = ''

  editMode = false
  constructor(private router: Router) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.editMode = false
    this.animal = selected.animal
    if(this.animal.id === 0) {
      await this.router.navigate(['/home'])
    }
    console.log(this.animal)
  }
  async goToProfile(username: string) {
    selected.userUsername = username
    await this.router.navigate(['/profile'])

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
    this.setOpen(true);
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  async changeEditMode(mode: boolean) {
    this.editMode = mode
  }
  protected readonly loggedUser = loggedUser;
  protected readonly UserTypes = UserTypes;
  protected readonly RequestType = RequestType;
  protected readonly selectedUser = selected;
}
