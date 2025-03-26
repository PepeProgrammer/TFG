import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {loggedUser} from "../../../variables";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  authenticationService = inject(AuthenticationService);
  error: string = '';

  constructor(private router: Router) {

  }

  async login() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (username === '' || password === '') {
      this.error = 'register.emptyFields'
      return
    }

    const response: any = await this.authenticationService.login(username, password)
    if (response.id !== undefined) {
      (document.getElementById('username') as HTMLInputElement).value = ''
      const password = (document.getElementById('password') as HTMLInputElement).value = ''
      loggedUser.setAuth(true)
      loggedUser.setType(response.type)
      loggedUser.setUsername(response.username)
      await this.router.navigate(['/home'])
      return
    }

    this.error = 'error'


  }

  ionViewWillEnter() {
    if (loggedUser.isAuth()) {
      this.router.navigate(['/home'])
    }
  }

}
