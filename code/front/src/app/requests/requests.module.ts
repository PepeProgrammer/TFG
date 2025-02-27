import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestsPageRoutingModule } from './requests-routing.module';

import { RequestsPage } from './requests.page';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RequestsPageRoutingModule,
        TranslatePipe
    ],
  declarations: [RequestsPage]
})
export class RequestsPageModule {}
