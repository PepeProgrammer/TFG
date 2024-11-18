import { Component } from '@angular/core';
import {home, search} from "ionicons/icons";
import {IonTabButton} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}

    protected readonly home = home;
  protected readonly search = search;

  changeSelected(button: Event) {
    console.log(button);
  }
}
