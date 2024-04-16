import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PosaoPreviewServiceService {
  naziv!:string;
  adresa:string='';
  opstina!:string;
  cijena!:number;
  opis:any="";
  posaoTip!:string;
  brojAplikanata!:number;
  deadline!:number;
  radnoVrijeme!:string[];
  dodatnoPlacanje!:string[];
  nacinPlacanja!:string;
  poslodavac!:string
  odabraniBtnRasporedPoslov:number[]=[]
  odabraniBtnDodatnoPlacanje:number[]=[]
  odabraniNacinPlacanja!:number
  constructor() { }
}
