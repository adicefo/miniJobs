import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MojConfig } from 'src/app/mojConfig';
import { AuthService } from 'src/app/services/auth.service';
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;
@Component({
  selector: 'app-preporuka',
  templateUrl: './preporuka.component.html',
  styleUrls: ['./preporuka.component.css']
})
export class PreporukaComponent {
  public podaci:any={
    opis:"",
    posaoTip_id:1,
    aplikant_id:0,
    prijedlogSatnice:5,
    nivoObrazovanja:"",
    cv:null,
    slika:null,
    iskustvo:""
  };
  public tipoviPoslova:any;
  public korisnik:any;

  public postavljeni:boolean=false;

  constructor(private authService:AuthService,private mojConfig:MojConfig,private http:HttpClient) {
    
  }

  ngOnInit()
  {
    this.http.get(this.mojConfig.adresaServera+"Autentifikacija/GetUserByUsername?username="+this.authService.getUserNameFromToken()).subscribe(
      x=>{
         this.korisnik=x;  
         console.log(this.korisnik);  
        });
    this.http.get(this.mojConfig.adresaServera+"PosaoTip/GetAll").subscribe(x=>{
      this.tipoviPoslova=x;
    });
  }


  postaviPodatke()
  {
       this.podaci.aplikant_id=this.korisnik.id;
  }


  updateAplikant(){
    this.http.patch(this.mojConfig.adresaServera+"Aplikant/Update",this.podaci).subscribe(x=>{
      porukaSuccess("Podaci zapremljeni "+this.korisnik.korisnickoIme)
    },(error)=>{
      porukaError("Molimo vas unesite odgovarajuće podatke");
    });
    ;
  }
  handleUpload(event: any,jelSlika:boolean=true) {
    console.log(event);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if(jelSlika)
          this.podaci.slika = e.target.result;
        else
          this.podaci.cv=e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }


}
