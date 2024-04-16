import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {TokenApiModel} from "../models/token-api.model";
import {MojConfig} from "../mojConfig";
import * as Console from "console";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService,private router:Router, private mojConfig:MojConfig) {}


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken=this.auth.getToken();
      if(myToken){
         request=request.clone({
        setHeaders:{Authorization:`Bearer ${myToken}`}
       })
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof  HttpErrorResponse){
          if(err.status===401)
          {
            return this.handleUnAuthorizedError(request,next);
           // alert("Token više nije validan, molimo Vas logirajte se ponovo");
            //this.router.navigate(['login']);
          }

        }
        return    throwError(()=>new Error("Pojavio je se neki problem."));
      })
    );
  }
  handleUnAuthorizedError(req:HttpRequest<any>, next: HttpHandler){
    let tokenApiModel=new TokenApiModel();
    tokenApiModel.accessToken=this.auth.getToken()!;
    tokenApiModel.refreshToken=this.auth.getRefreshToken()!;
    console.log(tokenApiModel);
    return this.mojConfig.renewToken(tokenApiModel).pipe(
      switchMap((data:TokenApiModel)=>{
        this.auth.spremiRefreshToken(data.refreshToken);
        this.auth.spremiToken(data.accessToken);
        req= req.clone({
          setHeaders:{Authorization:`Bearer ${data.accessToken}`}
        })
        return next.handle(req);
      }),
      catchError((err)=>{
        return    throwError(()=>{
          alert("Token više nije validan, molimo Vas logirajte se ponovo");
          this.router.navigate(['login']);
        });
      })
    )

  }
}
