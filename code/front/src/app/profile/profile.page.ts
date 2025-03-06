import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {getBaseUrl, loggedUser, UserTypes} from "../../../variables";
import {UsersService} from "../services/users.service";
import {User} from "../middleware/users";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  authenticationService = inject(AuthenticationService);
  userService = inject(UsersService)
  baseUrl: string

  user: User | null = null
  shelterHomeStatusChanged = false

  isToastOpen: boolean = false
  toastMessage: string = ""
  constructor(private router: Router) {
    this.baseUrl = getBaseUrl()
  }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.user = await this.userService.getUserLogged()
  }

  async logout() {
    await this.authenticationService.logout()
    loggedUser.setAuth(false)
    loggedUser.setType(UserTypes.NO_REGISTERED)
    await this.router.navigate(['/home'])
  }

  changeShelterHomeStatus() {
    this.shelterHomeStatusChanged = !this.shelterHomeStatusChanged
    if (this.user !== null) {
      this.user.shelterHome = !this.user.shelterHome
    }
  }

  async saveChanges() {
    if(this.user !== null){
      const user = await this.userService.updateUser(this.user)
      if(user !== null){
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

  protected readonly loggedUser = loggedUser;
  protected readonly UserTypes = UserTypes;
}
