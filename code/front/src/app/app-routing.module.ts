import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'add-animals',
    loadChildren: () => import('./add-animals/add-animals.module').then( m => m.AddAnimalsPageModule)
  },
  {
    path: 'lost-animals',
    loadChildren: () => import('./lost-animals/lost-animals.module').then( m => m.LostAnimalsPageModule)
  },
  {
    path: 'add-lost-animals',
    loadChildren: () => import('./add-lost-animals/add-lost-animals.module').then( m => m.AddLostAnimalsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
