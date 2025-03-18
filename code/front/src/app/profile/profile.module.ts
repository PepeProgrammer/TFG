import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {TranslatePipe} from "@ngx-translate/core";
import {ImageCropperComponent} from "ngx-image-cropper";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        TranslatePipe,
        ImageCropperComponent
    ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
