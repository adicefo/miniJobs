import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {cmbStavke} from "../../../models/cmbStavke";
import {MojConfig} from "../../../mojConfig";
import {Router} from "@angular/router";
import {PosaoVM} from "../../../models/PosaoVM";
import {PosaoPreview} from "../../../models/PosaoPreview";
import {PosaoServiceService} from "../../../services/posao.service.service";
import {PosaoPreviewServiceService} from "../../../services/posao-preview.service.service";
declare function porukaError(error: any):any;

@Component({
  selector: 'app-osnovne-informacije',
  templateUrl: './osnovne-informacije.component.html',
  styleUrls: ['./osnovne-informacije.component.css']
})
export class OsnovneInformacijeComponent implements OnInit {

  logo='./assets/Basic.PNG'
  forma!:FormGroup;
  lokacije!:cmbStavke[]
  filtiraneLokacije!:cmbStavke[]
  posao:PosaoVM=new PosaoVM();
  posaoPreview:PosaoPreview=new PosaoPreview()
  tipKorisnika="poslodavac"

  test!:any
  opstina_id:any


  constructor(private fb:FormBuilder,private mojConfig:MojConfig,private router:Router,private posaoService:PosaoServiceService,
              private posaoPreviewService:PosaoPreviewServiceService) {
    this.filtiraneLokacije = [];

  }
  ngOnInit(){
    this.forma=this.fb.group({
      naziv:['',Validators.required],
      lokacija:['',Validators.required],
      adresa:['']
    });
    this.mojConfig.getOpcineByDrzava(1).subscribe(
      (r:any)=>{
        this.lokacije=r
      })
    this.InitFields();
  }
  InitFields(){
  this.forma.get('naziv')?.setValue(this.posaoService.naziv);
  this.forma.get('adresa')?.setValue(this.posaoService.adresa);
  this.forma.get('lokacija')?.setValue(this.posaoPreviewService.opstina);
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

      this.getPosao()
      this.getPosaoPreview();
      this.router.navigate(['detalji-posla'])
    }
    else{
      this.validateAllFormFields(this.forma);
      porukaError("Molimo vas unesite odgovarajuće podatke");

    }
  }

  private getPosao() {

   this.posaoService.naziv=this.forma.get('naziv')?.value,
     this.posaoService.adresa=this.forma.get('adresa')?.value,
      this.posaoService.opstina_id=this.opstina_id

  }
  private getPosaoPreview() {

    this.posaoPreviewService.naziv=this.forma.get('naziv')?.value,
      this.posaoPreviewService.adresa=this.forma.get('adresa')?.value,
      this.posaoPreviewService.opstina=this.forma.get('lokacija')?.value

  }
  onInputChange():void {
    this.filtiraneLokacije= this.lokacije.filter(l => l.opis.toLowerCase().startsWith(this.forma.get('lokacija')!.value.toLowerCase()));
  }

  onTitleSelected(l: any): void {
    this.forma.get('lokacija')!.setValue( l.opis);
    this.opstina_id=l.id
    this.filtiraneLokacije = [];
  }
  goBack(){
    this.router.navigate(['poslodavac']);
  }

}
