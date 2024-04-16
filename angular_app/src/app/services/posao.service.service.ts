import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PosaoServiceService {
  naziv!:string;
  adresa!:string;
  opstina_id!:number;
  cijena!:number;
  opis!:any;
  posaoTip!:string
  posaoTip_id!:number;
  brojAplikanata!:number;
  deadline!:number;
  radnoVrijeme!:number[];
  dodatnoPlacanje!:number[];
  vrstaPlacanja!:number;
  poslodavacUserName!:string
  posao_id:number=0;
  constructor() { }
}
