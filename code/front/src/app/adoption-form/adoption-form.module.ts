import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptionFormPageRoutingModule } from './adoption-form-routing.module';

import { AdoptionFormPage } from './adoption-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptionFormPageRoutingModule
  ],
  declarations: [AdoptionFormPage]
})
export class AdoptionFormPageModule {}
