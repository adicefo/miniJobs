import { Component, Input } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {UserStoreService} from "../../services/user-store.service";
import {AuthService} from "../../services/auth.service";
import {MojConfig} from "../../mojConfig";
import {AplikantGetVM} from "../../models/AplikantGetVM";

@Component({
  selector: 'app-poslodavac',
  templateUrl: './poslodavac.component.html',
  styleUrls: ['./poslodavac.component.css']
})
export class PoslodavacComponent {
  @Input() tipKorisnika="poslodavac"
  jobs!:any [];
  userName:string='topcic';
  aplikanti!:AplikantGetVM [];
  constructor(private api:ApiService,private  router:Router,private userStore:UserStoreService,private auth:AuthService,
              private mojConfig:MojConfig) {
  }
  ngOnInit(){
    this.mojConfig.getAplikante().subscribe((r:any)=>{
      this.aplikanti=r;
    });

    this.userStore.getUserName().subscribe(r=>{
      let userNameFromToken=this.auth.getUserNameFromToken();
      this.userName= r ||userNameFromToken;
    })
  }

  odjaviSe(){
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
