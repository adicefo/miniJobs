import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfilNavigacijaService {

  private tipOpcije = new Subject<string>();
  data$ = this.tipOpcije.asObservable();
  constructor() {
    this.updateData('aktivni');
  }
  updateData(newData: string) {
    this.tipOpcije.next(newData);
  }
}
