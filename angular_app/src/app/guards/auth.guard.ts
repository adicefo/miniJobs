import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {UserStoreService} from "../services/user-store.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private userRole:string="";
  constructor(private auth:AuthService,private router:Router,private userStore:UserStoreService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }
  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.auth.isLoggedIn()) {
      this.userStore.getRole().subscribe(r=>{
        let rola=this.auth.getRoleFromToken();
        this.userRole=r||rola;
      })

      if (route.data['role'] && route.data['role'] .indexOf(this.userRole) === -1) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
      //   return userRole.includes(route.data['role']);
    }

    this.router.navigate(['login']);
    return false;
  }

}
