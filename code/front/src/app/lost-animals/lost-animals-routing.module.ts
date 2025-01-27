import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LostAnimalsPage } from './lost-animals.page';

const routes: Routes = [
  {
    path: '',
    component: LostAnimalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LostAnimalsPageRoutingModule {}
