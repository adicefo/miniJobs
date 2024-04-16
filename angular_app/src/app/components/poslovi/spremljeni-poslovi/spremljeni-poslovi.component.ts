import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MojConfig } from 'src/app/mojConfig';
import { HttpClient } from '@angular/common/http';

declare function porukaSuccess(m: string): any;
declare function porukaError(error: any): any;

@Component({
  selector: 'app-spremljeni-poslovi',
  templateUrl: './spremljeni-poslovi.component.html',
  styleUrls: ['./spremljeni-poslovi.component.css']
})
export class SpremljeniPosloviComponent {
  public spremljeniPoslovi: any;
  public apliciraniPoslovi: any;
  public korisnik: any;
  public novoApliciranje: any;
  public novaOcjena: any = null;
  public podaciOcjena: any = null;

  public tempUser: any = null;
  constructor(private authService: AuthService, private mojConfig: MojConfig, private httpClient: HttpClient) {

  }
  ngOnInit() {
    this.httpClient.get(this.mojConfig.adresaServera + "Autentifikacija/GetUserByUsername?username=" + this.authService.getUserNameFromToken()).subscribe(
      x => {
        this.korisnik = x;
        this.fetchPoslovi();
        this.fetchOcjene();
      });

  }
  apliciraj(obj: any) {
    this.novoApliciranje = {
      status: obj.status.toLocaleString(),
      datum_apliciranja: '2023-05-15T19:38:28.098Z',
      posao_id: obj.posao_id,
      aplikant_id: obj.aplikant_id
    };
    this.httpClient.post(this.mojConfig.adresaServera + "ApliciraniPosao/Add", this.novoApliciranje).subscribe(param => {
      porukaSuccess("Uspješno ste aplicirali " + this.korisnik.korisnickoIme);
      this.fetchPoslovi();
    });
  }
  obrisi(id: number) {
    this.httpClient.delete(this.mojConfig.adresaServera + "SpremljeniPosao/RemoveByID?id=" + id).subscribe(param => {
      this.fetchPoslovi();
    });
  }
  obrisiAplicirani(id: number) {
    this.httpClient.delete(this.mojConfig.adresaServera + "ApliciraniPosao/RemoveByID?id=" + id).subscribe(param => {
      porukaSuccess("Apliciranje uspješno izbrisano " + this.korisnik.korisnickoIme);
      this.fetchPoslovi();
    });
  }
  fetchOcjene() {
    this.httpClient.get(this.mojConfig.adresaServera + "Ocjena/GetOcjene?id=" + this.korisnik.id).subscribe(x => {
      console.log(x);
      this.podaciOcjena = x;
    });
  }
  fetchPoslovi() {
    this.httpClient.get(this.mojConfig.adresaServera + "SpremljeniPosao/GetByID?id=" + this.korisnik.id).subscribe(x => {
      this.spremljeniPoslovi = x;
    });
    this.httpClient.get(this.mojConfig.adresaServera + "ApliciraniPosao/GetByID?id=" + this.korisnik.id).subscribe(x => {
      this.apliciraniPoslovi = x;
    });
  }
  pripremiOcjenu() {
    this.httpClient.get(this.mojConfig.adresaServera + "Korisnik/GetById?id=" + this.podaciOcjena.ocjenjuje_id).subscribe
      (x => {
        this.tempUser = x;
        this.novaOcjena = {
          ocjenjujeUsername: this.authService.getUserNameFromToken(),
          ocjenjeniUsername: this.tempUser.korisnickoIme,
          ocjena: 0,
          komentar: "",
          posao_id: this.podaciOcjena.apliciraniPosao.posao_id
        }
      });

  }

  ocijeni() {
    this.httpClient.post(this.mojConfig.adresaServera + "Ocjena/Add", this.novaOcjena).subscribe(x => {
      porukaSuccess("Uspješno ocijenjen korisnik");
      this.novaOcjena = null;
    }, () => {
      porukaError("Korisnik ocijenjen");
    });
  }
}


