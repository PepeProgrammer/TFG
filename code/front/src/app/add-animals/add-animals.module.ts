import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAnimalsPageRoutingModule } from './add-animals-routing.module';

import { AddAnimalsPage } from './add-animals.page';
import {TranslatePipe} from "@ngx-translate/core";
import {ImageCropperComponent} from "ngx-image-cropper";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddAnimalsPageRoutingModule,
        ReactiveFormsModule,
        TranslatePipe,
        ImageCropperComponent
    ],
  declarations: [AddAnimalsPage]
})
export class AddAnimalsPageModule {}
