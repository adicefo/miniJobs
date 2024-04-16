import { Component,Input } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MojConfig} from "../../mojConfig";
import {NovaLozinkaService} from "../../services/nova-lozinka.service";
import {AuthService} from "../../services/auth.service";
import {UserStoreService} from "../../services/user-store.service";
import {PrivremeniAuthService} from "../../services/privremeni-auth.service";
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;
@Component({
  selector: 'app-email-verifikacija',
  templateUrl: './email-verifikacija.component.html',
  styleUrls: ['./email-verifikacija.component.css']
})
export class EmailVerifikacijaComponent {
  verifikaciskiKod:number=0
  email:any
  timer: number = 60;
  prethodnaAkcija:any

  sadrzaj:any=""
  constructor(private router:Router,private activatedRout:ActivatedRoute,private mojConfig:MojConfig,
              private novaLozinkaService:NovaLozinkaService,private userStore:UserStoreService,
              private privremeniAuth:PrivremeniAuthService,private auth:AuthService,)
  {

  }
  ngOnInit(){
    this.activatedRout.params.subscribe((res:any)=>{
      this.email=res["email"];
      this.prethodnaAkcija=res["prethodnaAkcija"];

      if(this.prethodnaAkcija==="registracija" || this.prethodnaAkcija==="login")
        this.sadrzaj="Još jedan korak! Poslali smo email sa kodom za verifikaciju na email"
      else
        this.sadrzaj="Molimo Vas da prije nego što promjenite lozinku da verifikujte email.  Poslali smo email sa kodom za verifikaciju na email ";

    })

  }
  onSubmit(){
    this.mojConfig.verifikacijaEmaila(this. verifikacijaEmail()).subscribe({
      next:(res:any)=>{
        this.auth.spremiToken(this.privremeniAuth.token);
        this.auth.spremiRefreshToken(this.privremeniAuth.refreshtoken);
        if(this.prethodnaAkcija==="registracija")
        this.router.navigate(['login'])
          else if(this.prethodnaAkcija==='login'){
           this.userStore.getRole().subscribe((r)=>{
             let tipKorisnika=r
             if(tipKorisnika=='Poslodavac')
             {this.router.navigate(['poslodavac']);}
             else
             { this.router.navigate(['aplikant']);}
             porukaSuccess("Uspješno ste logirani.")
            })

        }
          else  this.goToNovaLozinka();

      },
      error:(err:any)=>{
        porukaError("Pogrešan kod. Molimo Vas pokušajte ponovo.")
      }
    });
  }
  goToNovaLozinka(){
    this.novaLozinkaService.email= this.email;
    this.novaLozinkaService.svrha='nova lozinka';
    this.router.navigate(['nova-lozinka']);
  }
  verifikacijaEmail():any{
    let tipObj=this.prethodnaAkcija==="registracija"?"registracija":"login"
    return {
      email:this.email,
      kod:this.verifikaciskiKod,
      tip:tipObj

    }
  }
  resendCode() {
    let obj ={
      email:this.email,
      tip:this.prethodnaAkcija
    }
    this.mojConfig.resendverifikacijaEmaila(obj).subscribe((r:any)=>{
      porukaSuccess(r.message);
    })
  }

}
