import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {loggedUser, UserTypes} from "../../../variables";
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  loginPages = ['login', 'register']
  allUsersPages = ['home', 'lost-animals']
  associationPages = ['add-animals', 'add-lost-animals', 'profile']
  standardUserPages = ['add-lost-animals', 'profile']

  constructor(private router: Router, private location: Location) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const TEMPORAL = false
    let home = false

    if (TEMPORAL) { // Por si me quiero saltar la autenticación //TODO: Eliminar esto en producción
      return true
    }

    if (!loggedUser.isAuth()) {
      if (this.allUsersPages.includes(route.routeConfig?.path as string) || this.loginPages.includes(route.routeConfig?.path as string)) {
        return true
      } else {
        this.router.navigate(['/login'])
        return false
      }
    } else if (loggedUser.getType() === UserTypes.ASSOCIATION) {
      if (!this.associationPages.includes(route.routeConfig?.path as string) && !this.allUsersPages.includes(route.routeConfig?.path as string)) {
        home = true
      }
    } else if (loggedUser.getType() === UserTypes.STANDARD) {
      if (!this.standardUserPages.includes(route.routeConfig?.path as string) && !this.allUsersPages.includes(route.routeConfig?.path as string)) {
        home = true
      }
    }

    if (home) {
      this.router.navigate(['/home'])
      return false
    }
    return true
  }

}
