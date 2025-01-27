import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLostAnimalsPage } from './add-lost-animals.page';

const routes: Routes = [
  {
    path: '',
    component: AddLostAnimalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLostAnimalsPageRoutingModule {}
