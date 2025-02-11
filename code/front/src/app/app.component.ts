import {Component, inject} from '@angular/core';
import {home, search} from "ionicons/icons";
import {TranslateService} from "@ngx-translate/core";
import {ThemeService} from "./services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  themeService = inject(ThemeService)
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.themeService.initializeAppTheaming()
  }

    protected readonly home = home;
  protected readonly search = search;



}
