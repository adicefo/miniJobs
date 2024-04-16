import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private fullName$=new BehaviorSubject<string>("");
  private role$=new BehaviorSubject<string>("");

  constructor() { }
  public getRole(){
    return this.role$.asObservable();
  }
  public setRole(role:string){
    this.role$.next(role);
  }
  public getUserName(){
    return this.fullName$.asObservable();
  }
  public setUserName(UserName:string){
    this.fullName$.next(UserName);
  }
}
