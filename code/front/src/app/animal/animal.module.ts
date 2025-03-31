import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalPageRoutingModule } from './animal-routing.module';

import { AnimalPage } from './animal.page';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AnimalPageRoutingModule,
        TranslatePipe
    ],
  declarations: [AnimalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnimalPageModule {}
