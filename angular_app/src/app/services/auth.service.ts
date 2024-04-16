import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string="https://localhost:7109/";
  private userPayload:any;

  constructor(private http:HttpClient,private router:Router) {
    this.userPayload=this.decodeToken();
    console.log(this.userPayload);
  }

  spremiToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
  }

  getToken(){
    return localStorage.getItem('token');
  }
  isLoggedIn():boolean{
    return !!localStorage.getItem('token'); //ako ima vrijednost vratiti ce true inace false
  }



  decodeToken(){
    const jwtHelper=new JwtHelperService();
    const token=this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }
  getUserNameFromToken(){
    if (this.userPayload)
      return this.userPayload.unique_name;
  }
  getRoleFromToken(){
    if (this.userPayload)
      return this.userPayload.role;
  }
  spremiRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken',tokenValue)
  }


  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }
}
