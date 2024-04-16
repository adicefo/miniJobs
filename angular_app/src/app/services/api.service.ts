import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl:string='https://localhost:44352/';
  constructor(private http:HttpClient) { }
  getJobs(){
    return this.http.get<any>(this.baseUrl+'Posao/GetAll');
  }
}
