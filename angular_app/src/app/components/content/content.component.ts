import { HttpClient } from '@angular/common/http';
import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import { MojConfig } from "../../mojConfig";
import { SlicePipe } from '@angular/common';
import { UsermenuComponent } from "../usermenu/usermenu.component";
import { RegistracijaMenuComponent } from "../registracija/registracija-menu/registracija-menu.component";
import { Router } from "@angular/router";
import {cmbStavke} from "../../models/cmbStavke";
declare function porukaSuccess(m: string): any;
declare function porukaError(error: any): any;
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {

  @Input() tipKorisnika: string = "";
  @Input() prikazPoslovi: any;
  @Input() prikazAplikanti: any;
  @Input() korisnik: any;
  jelAplikant: boolean = this.tipKorisnika === 'aplikant';
  jelPoslodavac: boolean = this.tipKorisnika === 'poslodavac';

  public filtriraniPoslovi: any;
  public filtriraniAplikanti: any[] = [];



  aplikanti: any[] = [];
  slikaPutanja = "./assets/deafultUser.jpg"
  userSlika = ""

  public tempString: string = Date.now().toLocaleString();
  public datumUredi: string = "";

  public odredeniPoslovi: any;

  public gradSearch: string = "";
  public nazivSearch: string = "";

  public odabraniPosao: any = null;
  public odabraniAplkant: any;
  public novoApliciranje: any;

  public postavi: any = null;


  constructor(private mojConfig: MojConfig, private httpClient: HttpClient, private router: Router) {
  }

  ngOnChanges( ): void {
    if (this.tipKorisnika == '') {
      this.httpClient.get(this.mojConfig.adresaServera + "Posao/GetOdredeniBrojPoslova?brojposlova=5").subscribe(x => {
        this.odredeniPoslovi = x;
        console.log(this.odredeniPoslovi);
      });
    }
    this.filtriraniPoslovi = this.prikazPoslovi;
    if (this.tipKorisnika === 'Poslodavac' || this.tipKorisnika === 'poslodavac') {
      this.mojConfig.getAplikante().subscribe((r: any) => {
        this.aplikanti = r;
        this.filtriraniAplikanti = this.aplikanti
        this.filtriraniAplikanti.forEach(aplikant => {
          this.initDojamUserSlika(aplikant.slika);
        });
      })
    }

  }




  initDojamUserSlika(slika: any) {
    this.userSlika = slika !== '' ? 'data:image/jpeg;base64,' + slika : this.slikaPutanja
  }
  uredivanjeDatuma() {
    if (this.odabraniPosao != null) {
      this.tempString = this.odabraniPosao.deadline;
      this.datumUredi = this.tempString.slice(0, 11);
    }

  }
  goToProfil(username: string) {
    this.router.navigate(['profil'], { queryParams: { username: username } })
  }
  filtriraj(): void {
    this.filtriraniPoslovi = this.prikazPoslovi.filter((x: any) =>
    ((x.naziv.startsWith(this.nazivSearch) || x.naziv == null)
      && (x.opstina.startsWith(this.gradSearch) || x.opstina == null)));

    if (this.filtriraniPoslovi.length == 0)
      this.filtriraniPoslovi = this.prikazPoslovi;

  }
  filtrirajAplikante(): void {

    this.filtriraniAplikanti = this.aplikanti.filter((x: any) =>
    ((x.tipPosla && x.tipPosla.toLowerCase().startsWith(this.nazivSearch.toLowerCase()) || x.tipPosla == null) &&
      (x.opstina && x.opstina.toLowerCase().startsWith(this.gradSearch.toLowerCase()) || x.opstina == null)));

    if (this.filtriraniAplikanti.length === 0)
      this.filtriraniAplikanti = this.aplikanti;

  }
  apliciraj() {
    this.novoApliciranje = {
      status: "",
      datum_apliciranja: '2023-04-09T00:30:59.456Z', //radi errora probno
      posao_id: this.odabraniPosao.id,
      aplikant_id: this.korisnik.id
    };
    this.httpClient.post(this.mojConfig.adresaServera + "ApliciraniPosao/Add", this.novoApliciranje).subscribe(x => {
      porukaSuccess("Uspješno ste aplicirali " + this.korisnik.korisnickoIme)
    }, (error) => {
      porukaError("Aplicirali ste na postojeći oglas");
    });
    ;


  }

  spremiPosao() {
    this.novoApliciranje = {
      status: 0,
      posao_id: this.odabraniPosao.id,
      aplikant_id: this.korisnik.id
    };
    this.httpClient.post(this.mojConfig.adresaServera + "SpremljeniPosao/Add", this.novoApliciranje).subscribe(x => {
      porukaSuccess("Posao uspješno spremljen " + this.korisnik.korisnickoIme)
    }, (error) => {
      porukaError("Oglas već zapremljen");
    });
  }

  pripremiPostavljanje() {
    this.postavi = {
      datum_kreiranja: '2023-04-09T00:30:59.456Z', //radi errora probno
      naziv: "",
      posao_id: this.odabraniPosao.id
    }
  }

  postaviPitanje() {
    this.httpClient.post(this.mojConfig.adresaServera + "PitanjeThread/Add", this.postavi).subscribe(x => {
      this.postavi = null;
      porukaSuccess("Pitanje uspješno postavljeno " + this.korisnik.korisnickoIme)
    });
  }
}





