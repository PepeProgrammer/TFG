import {inject, NgModule} from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {loggedUser} from "../../variables";
import {AuthGuardService} from "./services/auth-guard.service";

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
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-animals',
    loadChildren: () => import('./add-animals/add-animals.module').then( m => m.AddAnimalsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'lost-animals',
    loadChildren: () => import('./lost-animals/lost-animals.module').then( m => m.LostAnimalsPageModule)
  },
  {
    path: 'add-lost-animals',
    loadChildren: () => import('./add-lost-animals/add-lost-animals.module').then( m => m.AddLostAnimalsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'requests',
    loadChildren: () => import('./requests/requests.module').then( m => m.RequestsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'adoption-form',
    loadChildren: () => import('./adoption-form/adoption-form.module').then( m => m.AdoptionFormPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'animal',
    loadChildren: () => import('./animal/animal.module').then( m => m.AnimalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [AuthGuardService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
