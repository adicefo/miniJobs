import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MojConfig } from 'src/app/mojConfig';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-aplikant',
  templateUrl: './aplikant.component.html',
  styleUrls: ['./aplikant.component.css']
})
export class AplikantComponent {
  @Input() tipKorisnika:string="aplikant";
  public poslovi: any;
  public korisnik:any;
  constructor(public autService:AuthService,public httpClient:HttpClient,public mojConfig:MojConfig){
    
  }
  ngOnInit():void{
      this.httpClient.get(this.mojConfig.adresaServera+"Posao/GetAll").subscribe(x=>{
      this.poslovi=x;
      console.log(this.poslovi);
    });
    this.httpClient.get(this.mojConfig.adresaServera+"Autentifikacija/GetUserByUsername?username="+this.autService.getUserNameFromToken()).subscribe(x=>{
      this.korisnik=x;
    });
  }

}
