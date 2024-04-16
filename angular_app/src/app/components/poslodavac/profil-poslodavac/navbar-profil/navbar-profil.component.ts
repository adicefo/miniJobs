import { Component } from '@angular/core';
import {ProfilNavigacijaService} from "../../../../services/profil-navigacija.service";
import {AuthService} from "../../../../services/auth.service";
import {ProfilService} from "../../../../services/profil.service";

@Component({
  selector: 'app-navbar-profil',
  templateUrl: './navbar-profil.component.html',
  styleUrls: ['./navbar-profil.component.css']
})
export class NavbarProfilComponent {
  tipKorisnika=''
  naslov=''
  opcija='';
  labelColorAktivni: string = '#666666';
  backgroundColorAktivni: string = '#cccccc';
  labelColorZavrseni: string = '#666666';
  backgroundColorZavrseni: string = '#cccccc';
  labelColorDojmovi = '#666666';
  backgroundColorDojmovi= '#cccccc';
  constructor(private profilNavigacija:ProfilNavigacijaService,private auth:AuthService,private profileService:ProfilService) {

  }
  ngOnInit(){

    this.Odabrani('aktivni');

  }
  Odabrani(opcija:string){
    this.tipKorisnika=this.profileService.tipKorisnika
    if(this.tipKorisnika=='Poslodavac')
      this.naslov='Aktivni poslovi'
    else
      this.naslov='Informacije'
    this.opcija=opcija;
    this.profilNavigacija.updateData(opcija);
    let bojaOdabranog='#d70dc6';
    let boja='#666666';
    if(this.opcija==='aktivni'){
      this.labelColorAktivni = bojaOdabranog;
      this.backgroundColorAktivni = bojaOdabranog;
      this.labelColorZavrseni = boja;
      this.backgroundColorZavrseni = boja;
      this.labelColorDojmovi = boja;
      this.backgroundColorDojmovi = boja;
    }
    else if( this.opcija==='zavrseni'){
      this.labelColorZavrseni = bojaOdabranog;
      this.backgroundColorZavrseni = bojaOdabranog;
      this.labelColorAktivni = boja;
      this.backgroundColorAktivni = boja;
      this.labelColorDojmovi = boja;
      this.backgroundColorDojmovi = boja;
    }
    else {
      this.labelColorDojmovi = bojaOdabranog;
      this.backgroundColorDojmovi = bojaOdabranog;
      this.labelColorAktivni = boja;
      this.backgroundColorAktivni = boja;
      this.labelColorZavrseni = boja;
      this.backgroundColorZavrseni = boja;
    }
  }
  onMouseOver(opcija:string) {
    let boja='#e869dc';
    if(opcija==='aktivni' && this.opcija!=='aktivni'){
      this.labelColorAktivni = boja;
      this.backgroundColorAktivni = boja;
    }
    else if(opcija==='zavrseni'&& this.opcija!=='zavrseni'){
      this.labelColorZavrseni = boja;
      this.backgroundColorZavrseni = boja;
    }
    else if (opcija==='dojmovi' && this.opcija!=='dojmovi') {
      this.labelColorDojmovi = boja;
      this.backgroundColorDojmovi = boja;
    }
  }

  onMouseOut(opcija:string) {
    let boja='#666666';
    if(opcija==='aktivni' && this.opcija!=='aktivni'){
      this.labelColorAktivni = boja;
      this.backgroundColorAktivni = boja;
    }
    else if(opcija==='zavrseni'&& this.opcija!=='zavrseni'){
      this.labelColorZavrseni = boja;
      this.backgroundColorZavrseni = boja;
    }
    else if(opcija==='dojmovi' && this.opcija!=='dojmovi'){
      this.labelColorDojmovi = boja;
      this.backgroundColorDojmovi = boja;
    }

  }
}
