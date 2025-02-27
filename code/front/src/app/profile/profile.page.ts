import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {loggedUser, UserTypes} from "../../../variables";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  authenticationService = inject(AuthenticationService);
  constructor(private router: Router) { }

  ngOnInit() {
  }

  async logout() {
    await this.authenticationService.logout()
    loggedUser.setAuth(false)
    loggedUser.setType(UserTypes.NO_REGISTERED)
    await this.router.navigate(['/home'])
  }

}
