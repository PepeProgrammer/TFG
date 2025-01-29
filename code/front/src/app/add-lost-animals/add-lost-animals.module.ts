import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLostAnimalsPageRoutingModule } from './add-lost-animals-routing.module';

import { AddLostAnimalsPage } from './add-lost-animals.page';
import {TranslatePipe} from "@ngx-translate/core";
import {ImageCropperComponent} from "ngx-image-cropper";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddLostAnimalsPageRoutingModule,
    ReactiveFormsModule,
    TranslatePipe,
    ImageCropperComponent
  ],
  declarations: [AddLostAnimalsPage]
})
export class AddLostAnimalsPageModule {}
