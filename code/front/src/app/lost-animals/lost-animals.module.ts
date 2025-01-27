import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LostAnimalsPageRoutingModule } from './lost-animals-routing.module';

import { LostAnimalsPage } from './lost-animals.page';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LostAnimalsPageRoutingModule,
    TranslatePipe,
    NgOptimizedImage
  ],
  declarations: [LostAnimalsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LostAnimalsPageModule {}
