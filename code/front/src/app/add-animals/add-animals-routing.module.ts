import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAnimalsPage } from './add-animals.page';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
const routes: Routes = [
  {
    path: '',
    component: AddAnimalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAnimalsPageRoutingModule {}

defineCustomElements(window);
