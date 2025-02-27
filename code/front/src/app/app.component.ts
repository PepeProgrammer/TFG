import {Component, inject, OnInit} from '@angular/core';
import {home, search} from "ionicons/icons";
import {TranslateService} from "@ngx-translate/core";
import {ThemeService} from "./services/theme.service";
import {AuthenticationService} from "./services/authentication.service";
import {loggedUser} from "../../variables";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  themeService = inject(ThemeService)
  authService = inject(AuthenticationService)

  async ngOnInit() {
    console.log('NgInit')
    const loggedData = await this.authService.isSessionValid()
    loggedUser.setAuth(loggedData.isSessionEnabled)
    loggedUser.setType(loggedData.type)
    console.log(loggedData)

  }

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.themeService.initializeAppTheaming()
  }

  protected readonly home = home;
  protected readonly search = search;


  protected readonly loggedUser = loggedUser;
}
