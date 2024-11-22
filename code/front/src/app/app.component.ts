import { Component } from '@angular/core';
import {home, search} from "ionicons/icons";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
  }

    protected readonly home = home;
  protected readonly search = search;



}
