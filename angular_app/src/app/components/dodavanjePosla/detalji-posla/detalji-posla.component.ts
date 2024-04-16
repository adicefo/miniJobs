import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MojConfig} from "../../../mojConfig";
import {PosaoTip} from "../../../models/PosaoTip";
import {cmbStavke} from "../../../models/cmbStavke";
import {ActivatedRoute, Router} from "@angular/router";
import {PosaoVM} from "../../../models/PosaoVM";
import {PosaoPreview} from "../../../models/PosaoPreview";
import {PosaoServiceService} from "../../../services/posao.service.service";
import {PosaoPreviewServiceService} from "../../../services/posao-preview.service.service";
declare function porukaError(error: any):any;

@Component({
  selector: 'app-detalji-posla',
  templateUrl: './detalji-posla.component.html',
  styleUrls: ['./detalji-posla.component.css']
})
export class DetaljiPoslaComponent implements OnInit {

  logo = "./assets/detalji.jpg"
  tipKorisnika="poslodavac"
  forma!:FormGroup
  posaoTipovi!:PosaoTip[];
  posaoTip_id:number=-1
  filteredJobTitles: PosaoTip[] = [];
  posao!:PosaoVM;
  rasporedi!:cmbStavke[]
  brojLjudi=["1","2","3","4","5","6","7","8","9","10","10+"]
  _brojLjudi:any
  vrijeme=["1 do 3 dana","3 do 7 dana","1 do 2 sedmice","2 do 4 sedmice"]
  posaoPreview:PosaoPreview=new PosaoPreview()

  posaoTip:any=''
  trenutni:any
  isMouseOverVrijeme: boolean[] = [];
  isMouseOverRaspored: boolean[] = [];



  constructor(private mojConfig:MojConfig,private fb :FormBuilder,private route:ActivatedRoute,public router:Router,
              private posaoService:PosaoServiceService,
              private posaoPreviewService:PosaoPreviewServiceService) {
    this.posao=new PosaoVM();
  }

  ngOnInit(){
    this.forma=this.fb.group({
      posaoTip:['',Validators.required],
      raspored:['',Validators.required],
      brojLjudi:['',Validators.required],
      vrijeme:['',Validators.required]
    });
    this.mojConfig.getPosaoTipAll().subscribe((r:any)=>{
      this.posaoTipovi=r
    })
    this.mojConfig.getPitanjePonuđeniOdgovori(1).subscribe(
      (r:any)=>{
        this.rasporedi=r
        this.showRasporedPoslova();
        this.InitFields();
      }
    )
    this.forma.get('brojLjudi')?.setValue(1);


  }
  InitFields(){
    this.forma.get('posaoTip')?.setValue(this.posaoPreviewService.posaoTip);
    this.selectedButtonRasporedPoslova=this.posaoPreviewService.odabraniBtnRasporedPoslov
    this.forma.get('raspored')?.setValue(this.posaoPreviewService.odabraniBtnRasporedPoslov.length===0?'':1);
    this.forma.get('brojLjudi')?.setValue(this.posaoPreviewService.brojAplikanata);
    this.forma.get('vrijeme')?.setValue(this.getVrijemeZaSet(this.posaoService.deadline));
    this.selectedBtnVrijeme=this.getVrijemeZaSet(this.posaoService.deadline);

  }

  onInputChange():void {
    this.filteredJobTitles= this.posaoTipovi.filter(
      pt => pt.naziv.toLowerCase().startsWith(this.forma.get('posaoTip')?.value.toLowerCase())
    );
  }

  onTitleSelected(posaoTip: any): void {
    this.forma.get('posaoTip')?.setValue(posaoTip.naziv);
    this.filteredJobTitles = [];
    this.posaoTip_id=posaoTip.id
  }



  prikaziRasporedePoslova: any;
  showAllRasporede = true;
  dugmicTitleRasporedPosla = "manje";


  selectedButtonRasporedPoslova: any[] = [];
  odabraniRasporedPosla: number[] = [];
  odabraniRasporedPoslaPreview: string[] = [];

  selectedBtnVrijeme:any=-1




  showRasporedPoslova() {
    this.showAllRasporede == true ? this.showAllRasporede = false : this.showAllRasporede = true;
    this.dugmicTitleRasporedPosla == "više" ? this.dugmicTitleRasporedPosla = "manje" : this.dugmicTitleRasporedPosla = "više";
    this.showAllRasporede == true ? this.prikaziRasporedePoslova = this.rasporedi : this.prikaziRasporedePoslova = this.rasporedi.slice(0, 5);

  }



  provjeriButtonRaporedPosla(i: number,r:any) {
    if (this.selectedButtonRasporedPoslova.indexOf(i) !== -1) {
      this.selectedButtonRasporedPoslova.splice(this.selectedButtonRasporedPoslova.indexOf(i), 1); // remove the number 5
      this.odabraniRasporedPosla.splice(this.odabraniRasporedPosla.indexOf(r.id), 1);
      this.odabraniRasporedPoslaPreview.splice(this.odabraniRasporedPoslaPreview.indexOf(r.opis), 1);

    } else {
      this.selectedButtonRasporedPoslova.push(i);
      this.odabraniRasporedPosla.push(r.id);
      this.odabraniRasporedPoslaPreview.push(r.opis)
      this.forma.get('raspored')?.setValue(i);
    }
    if(this.selectedButtonRasporedPoslova.length===0)
      this.forma.get('raspored')?.setValue(null);
  }
  provjeriButtonVrijeme(i: number) {
    this.selectedBtnVrijeme=i
    this.forma.get('vrijeme')?.setValue(i);


  }

  getIkonicaClass(i: number) {
    return this.selectedButtonRasporedPoslova.indexOf(i) !== -1  ? 'fa fa-check' : 'fa fa-plus';
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
      this.router.navigate(['opis-placanje']);
    }
    else{
      this.validateAllFormFields(this.forma);
      porukaError("Molimo vas unesite odgovarajuće podatke");

    }
  }
  getVrijeme(vrijeme:number):number{
    if (vrijeme===0)
      return 3;
    else if(vrijeme===1)
      return 7;
    else if(vrijeme===2)
      return 14;
    else return 28;
      }
  getVrijemeZaSet(vrijeme:number):number{
    if (vrijeme===3)
      return 0;
    else if(vrijeme===7)
      return 1;
    else if(vrijeme===14)
      return 2;
    else if (vrijeme===28)
      return 3;
    else return -1;
  }
  getPosao(){

    this.posaoService.posaoTip_id=this.posaoTip_id;
    if(this.posaoTip_id===-1)
      this.posaoService.posaoTip=this.forma.get('posaoTip')?.value;
    this.posaoService.brojAplikanata=this.forma.get('brojLjudi')?.value;
    this.posaoService.deadline=this.getVrijeme(this.forma.get('vrijeme')?.value);
    this.posaoService.radnoVrijeme=this.odabraniRasporedPosla;
  }
  getPosaoPreview(){

    this.posaoPreviewService.posaoTip=this.forma.get('posaoTip')?.value;
    this.posaoPreviewService.brojAplikanata=this.forma.get('brojLjudi')?.value;
    this.posaoPreviewService.deadline=this.getVrijeme(this.forma.get('vrijeme')?.value);
    this.posaoPreviewService.radnoVrijeme=this.odabraniRasporedPoslaPreview;
    this.posaoPreviewService.odabraniBtnRasporedPoslov=this.selectedButtonRasporedPoslova
  }
}
