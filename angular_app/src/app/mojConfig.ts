import {Router} from "@angular/router";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Injectable } from '@angular/core';
import {TokenApiModel} from "./models/token-api.model";
import {PosaoVM} from "./models/PosaoVM";
import {user} from "./models/UserVM";
@Injectable({
  providedIn: 'root'
})
export class MojConfig {

  public  adresaServera="https://localhost:44352/";
  public adresaServera2:string="https://localhost:7109/";
  user!:user;

  constructor(private http:HttpClient,private router:Router) {

  }
  login(loginObj:any){
    return this.http.post<any>(this.adresaServera+"Autentifikacija/Login",loginObj);
  }
  registracija(registracijaObj:any){

    return this.http.post<any>(this.adresaServera+"Autentifikacija/Registracija",registracijaObj);
  }
  registracijaPoslodavac(registracijaObj:any){

    return this.http.post<any>(this.adresaServera+"Autentifikacija/RegistracijaPoslodavac",registracijaObj);
  }
  poslodavacUpdatePodatke(registracijaObj:any){

    return this.http.post<any>(this.adresaServera+"Korisnik/PoslodavacUpdatePodatke",registracijaObj);
  }
  aplikantUpdatePodatke(registracijaObj:any){

    return this.http.post<any>(this.adresaServera+"Korisnik/AplikantUpdatePodatke",registracijaObj);
  }
  updateDodatneInformacije(registracijaObj:any){

    return this.http.post<any>(this.adresaServera+"Korisnik/AddDodatneInformacije",registracijaObj);
  }

  renewToken(tokenApi:TokenApiModel){
    return this.http.post<any>(this.adresaServera+"Autentifikacija/Refresh",tokenApi);
  }
  resendverifikacijaEmaila(obj:any) {
    const body = JSON.stringify(obj);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.adresaServera + 'Autentifikacija/ResendVerifikacijaEmail', body, { headers: headers });
  }
  verifikacijaEmaila(verifikaciskiKod:any){
    return this.http.post<any>(this.adresaServera+"Autentifikacija/VerifikacijaEmail",verifikaciskiKod);
  }
  getUserByUsernameAndRole(userVM:user){

    return this.http.get(this.adresaServera+'Autentifikacija/GetUserByUsername?'+`username=${userVM.username}&role=${userVM.role}`);
  }
  GetProfilByUsername(username:string){

    return this.http.get(this.adresaServera+'Korisnik/GetProfilByUsername?'+`username=${username}`);
  }
  GetDojmoveByUsername(username:string){

    return this.http.get(this.adresaServera+'Korisnik/GetDojmoveByUsername?'+`username=${username}`);
  }

  obrisiKorisnickiNalog(username:string){
    const body = JSON.stringify(username);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.adresaServera+'Korisnik/ObrisiKorisnickiNalog', body, { headers: headers });
  }
  novaLozinka(obj:any){
    return this.http.post<any>(this.adresaServera+"Autentifikacija/ZamjeniLozinku",obj);

  }
  getPosaoTipAll(){
    return this.http.get(this.adresaServera+"PosaoTip/GetAll");
  }
  //GetOcjenjeneAplikanteByPosaoId
  GetOcjenjeneAplikanteByPosaoId(posao_id:number){
    let params = new HttpParams().set('posao_id', posao_id);
    let options = { params: params };
    return this.http.get(this.adresaServera+"Ocjena/GetOcjenjeneAplikanteByPosaoId",options);
  }
  getPitanjePonuđeniOdgovori(posao_id:number){
    let params = new HttpParams().set('posao_id', posao_id);
    let options = { params: params };
    return this.http.get(this.adresaServera+"PonudjeniOdgovori/GetByPosaoId",options);
  }
  getOpcineByDrzava(drzava_id:number){
    let params = new HttpParams().set('drzava_id', drzava_id);
    let options = { params: params };
    return this.http.get(this.adresaServera+"Opstina/GetByDrzava",options);
  }
  addPosao(posao:PosaoVM){
    return this.http.post<any>(this.adresaServera+"Posao/Add",posao);
  }
  addOcjenu(ocjena:any){
    return this.http.post<any>(this.adresaServera+"Ocjena/Add",ocjena);
  }
  getAplikante(){
    //Aplikant/Get
    return this.http.get(this.adresaServera+"Aplikant/Get");
  }
  //Posao/GetPosloveByUsername
  getPosloveByUsername(username:string){
    let params = new HttpParams().set('username', username);
    let options = { params: params };
    return this.http.get(this.adresaServera+"Posao/GetPosloveByUsername",options);
  }
  GetAplikantZavrsenePosloveByUsername(username:string){
    let params = new HttpParams().set('username', username);
    let options = { params: params };
    return this.http.get(this.adresaServera+"Posao/GetAplikantZavrsenePosloveByUsername",options);
  }
  //Aplikant/GetByPosaoId
  GetAplikanteByPosaoId(id:number){
    let params = new HttpParams().set('id', id);
    let options = { params: params };
    return this.http.get(this.adresaServera+"Aplikant/GetByPosaoId",options);
  }
  updatePosao(posao:PosaoVM){
    return this.http.post<any>(this.adresaServera+"Posao/Update",posao);
  }
  deletePosaoById(posaoId:number){
    let params = new HttpParams().set('id', posaoId);
    let options = { params: params };
    return this.http.delete<any>(this.adresaServera+"Posao/DeleteById",options);
  }
}
