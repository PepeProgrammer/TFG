import {Component, inject, OnInit} from '@angular/core';
import {home, search} from "ionicons/icons";
import {TranslateService} from "@ngx-translate/core";
import {ThemeService} from "./services/theme.service";
import {AuthenticationService} from "./services/authentication.service";
import {loggedUser, selected, UserTypes} from "../../variables";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  themeService = inject(ThemeService)
  authService = inject(AuthenticationService)

  async ngOnInit() {
    await this.authService.saveLoggedUser()

  }

  constructor(private translate: TranslateService, private router: Router) {
    this.translate.setDefaultLang(this.translate.getBrowserLang() as string); //coge el idioma del sistema para ponerlo por defecto
    this.translate.setDefaultLang('es');
  
    this.themeService.initializeAppTheaming()
  }

async goToMyProfile() {
  selected.userUsername = ''
  if(this.router.url === '/profile') {
    await this.router.navigate(['/home'])
  }
  await this.router.navigate(['/profile'])
}

  protected readonly home = home;
  protected readonly search = search;


  protected readonly loggedUser = loggedUser;
    protected readonly UserTypes = UserTypes;
}
