import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptionFormPage } from './adoption-form.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptionFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionFormPageRoutingModule {}
