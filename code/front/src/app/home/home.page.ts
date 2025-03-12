import {Component, inject, OnInit} from '@angular/core';
import {AnimalsService} from "../services/animals.service";
import {Association, Filter} from "../../types";
import {getBaseUrl, loggedUser, UserTypes} from "../../../variables";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {RequestsService} from "../services/requests.service";
import {RequestType} from "../middleware/requests";
import {User, UserShelter} from "../middleware/users";
import {UsersService} from "../services/users.service";
import {Animal, createVoidAnimal} from "../middleware/animals";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  animalService = inject(AnimalsService)
  requestService = inject(RequestsService)
  userService = inject(UsersService)

  animals: Animal[] = []
  filters: Filter | undefined

  selectedSpecies: string = ''
  selectedAge: string = ''
  selectedState: string = ''

  baseUrl = getBaseUrl()
  offset = 0
  range = 5

  disableScroll: boolean = false

  isToastOpen: boolean = false
  toastMessage: string = ""

  isModalOpen: boolean = false
  statesChip = false

  AreModalFiltersOpen = false

  usersShelter: UserShelter[] = []
  animalSelected: Animal
  shelterHomeUsers: User[] | undefined
  modalFilters: { states: string[] }
  modalStateNames: string[] = []
  constructor() {
    this.animalSelected = createVoidAnimal()
    this.modalFilters = {states: []}
  }

  async ngOnInit() {
    this.filters = await this.animalService.getFilters(28) // TODO: found a way to get the country
  }

  async ionViewDidEnter() {
    this.offset = 0
    this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, this.selectedAge)
    console.log(this.animals)
    this.offset += this.range//con esto hago que la próxima vez busque los siguientes 5 animales

  }

  async applyFilters() {
    if (this.selectedState !== '' || this.selectedAge !== '' || this.selectedSpecies !== '') {
      this.offset = 0
      this.animals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, this.selectedAge)
      this.offset += this.range
    }
  }

  async applyFiltersModal() {
    if (this.modalFilters.states.length > 0) {
      this.statesChip = true
      this.getStateNames()
    }

    this.usersShelter = await this.userService.getShelterUsers(this.modalFilters)
    this.showModalFilters(false)
  }

  async removeFilterModal(filter: string) {
    if (filter === 'state') {
      this.statesChip = false
      this.modalFilters.states = []
    }

    await this.applyFiltersModal()

  }

  async onIonInfinite(event: any) {
    const newAnimals = await this.animalService.getAnimalByFilters(this.selectedState, this.selectedSpecies, this.offset, this.range, this.selectedAge)
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

  cleanOffset() {
    this.offset = 0
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

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  async setOpenModal(isOpen: boolean, animal: Animal = createVoidAnimal()) {
    if (this.usersShelter.length === 0) {
      this.usersShelter = await this.userService.getShelterUsers()
    }
    this.animalSelected = animal

    this.isModalOpen = isOpen;

  }

  showModalFilters(show: boolean) {
    this.AreModalFiltersOpen = show
  }

  getStateNames() {
    this.modalStateNames = []
    for (const statesId in this.modalFilters.states) {
      this.modalStateNames.push(this.filters?.states.find(state => state.id === +this.modalFilters.states[statesId])?.name as string)
    }
  }


  protected readonly loggedUser = loggedUser;
  protected readonly UserTypes = UserTypes;
  protected readonly RequestType = RequestType;
}

