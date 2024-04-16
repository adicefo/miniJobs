import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MojConfig} from "../../../mojConfig";
import {cmbStavke} from "../../../models/cmbStavke";
import {PosaoVM} from "../../../models/PosaoVM";
import {PosaoPreview} from "../../../models/PosaoPreview";
import {UserStoreService} from "../../../services/user-store.service";
import {PosaoServiceService} from "../../../services/posao.service.service";
import {PosaoPreviewServiceService} from "../../../services/posao-preview.service.service";
import {AuthService} from "../../../services/auth.service";
declare function porukaError(error: any):any;

@Component({
  selector: 'app-opis-posla',
  templateUrl: './opis-posla.component.html',
  styleUrls: ['./opis-posla.component.css']
})
export class OpisPoslaComponent {
  ckeditorContent:any;
  tipKorisnika="poslodavac"
  logo='./assets/opisCijena.jpg'
  forma!:FormGroup;
  posao:PosaoVM=new PosaoVM();
  posaoPreview:PosaoPreview=new PosaoPreview()
  selectedBtnNacinPlacanja=-1
  nacinPlacanja!: cmbStavke[]
  dodatnoPlacanje!: cmbStavke[]
  nacinPlacanja_id:number=0

  isMouseOverNacinPlacanja: boolean[] = [];
  isMouseOverDodatno: boolean[] = [];
  selectedButtonDodatno: any[] = [];
  odabranoDodatno:number[]=[]
  odabranoDodatnoPreview:string[]=[]

  constructor(private fb:FormBuilder,public router:Router, private sanitizer: DomSanitizer,private mojConfig:MojConfig
              , private userStore:UserStoreService,private posaoService:PosaoServiceService,
              private posaoPreviewService:PosaoPreviewServiceService,private auth:AuthService) {
  }
  ngOnInit(){

    this.forma=this.fb.group({
      opis:['',Validators.required],
      nacinPlacanja:['',Validators.required],
      cijena:['',Validators.required]
    });
    this.mojConfig.getPitanjePonuđeniOdgovori(2).subscribe(
      (r:any)=>{
        this.nacinPlacanja=r
      })
    this.mojConfig.getPitanjePonuđeniOdgovori(3).subscribe(
      (r:any)=>{
        this.dodatnoPlacanje=r
      })
    this.InitFields();
  }
  InitFields(){
    this.forma.get('opis')?.setValue(this.posaoPreviewService.opis);
    this.selectedBtnNacinPlacanja=this.posaoPreviewService.odabraniNacinPlacanja
    this.forma.get('nacinPlacanja')?.setValue(this.posaoPreviewService.nacinPlacanja);
    this.forma.get('cijena')?.setValue(this.posaoPreviewService.cijena);
    this.selectedButtonDodatno=this.posaoPreviewService.odabraniBtnDodatnoPlacanje
  }
  checkField(fieldName: string): boolean {
    return this.forma.controls[fieldName].dirty && this.forma.hasError('required', fieldName)
  }
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }

  nastavi(){
    if (this.forma.valid){

      this.getPosao();
      this.getPosaoPreview();

      this.router.navigate(['preview']);
    }
    else{
      this.validateAllFormFields(this.forma);
      porukaError("Molimo vas unesite odgovarajuće podatke");

    }
  }
  getPosao(){
    this.posaoService.cijena=this.forma.get('cijena')?.value;
    this.posaoService.dodatnoPlacanje=this.odabranoDodatno;
    this.posaoService.vrstaPlacanja=this.nacinPlacanja_id;
    this.posaoService.opis= this.forma.get('opis')?.value

  }
  getPosaoPreview(){
    this.posaoPreviewService.cijena = this.forma.get('cijena')?.value;
    this.posaoPreviewService.dodatnoPlacanje = this.odabranoDodatnoPreview;
    this.posaoPreviewService.nacinPlacanja = this.forma.get('nacinPlacanja')?.value;
    this.posaoPreviewService.opis =this.forma.get('opis')?.value
  //  this.posaoPreview.poslodavac=this.userStore.getUserName();
    this.userStore.getUserName().subscribe(r=>{
      let rola=this.auth.getUserNameFromToken();
      this.posaoPreviewService.poslodavac=r||rola;
      console.log('auth'+r);
      console.log('fromtoken '+rola)
      console.log('preview'+this.posaoPreviewService.poslodavac)
    })
    //this.posaoPreviewService.poslodavac=this.auth.getUserNameFromToken();
   // this.posaoPreviewService.poslodavac="topcic27"
    this.posaoPreviewService.odabraniNacinPlacanja=this.selectedBtnNacinPlacanja
    this.posaoPreviewService.odabraniBtnDodatnoPlacanje=this.selectedButtonDodatno
  }
  provjeriButtonNacinPlacanja(i: number,placanje:any) {

    this.forma.get('cijena')?.setValue(null);
    this.selectedBtnNacinPlacanja=i
    this.forma.get('nacinPlacanja')?.setValue(placanje.opis);
    this.nacinPlacanja_id=placanje.id
    if(placanje.opis==='po dogovoru')
      this.forma.get('cijena')?.setValue(-2);


  }
  provjeriButtonDodatnoPlacanje(i: number,r:any) {
    if (this.selectedButtonDodatno.indexOf(i) !== -1) {
      this.selectedButtonDodatno.splice(this.selectedButtonDodatno.indexOf(i), 1); // remove the number 5
      this.odabranoDodatno.splice(this.odabranoDodatno.indexOf(r.id), 1);
      this.odabranoDodatno.splice(this.odabranoDodatno.indexOf(r.opis), 1);

    } else {
      this.selectedButtonDodatno.push(i);
      this.odabranoDodatno.push(r.id);
      this.odabranoDodatnoPreview.push(r.opis);


    }
  }
  getIkonicaClass(i: number) {
    return this.selectedButtonDodatno.indexOf(i) !== -1  ? 'fa fa-check' : 'fa fa-plus';
  }

}
