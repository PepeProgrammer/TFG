import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import {TranslatePipe} from "@ngx-translate/core";
import {ImageCropperComponent} from "ngx-image-cropper";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    TranslatePipe,
    ReactiveFormsModule,
    ImageCropperComponent
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
