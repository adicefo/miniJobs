import { Component } from '@angular/core';
import {DatePipe} from "@angular/common";
import {GetPosaoByUsernameVM} from "../../models/getPosaoByUsernameVM";
import {MojConfig} from "../../mojConfig";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {cmbStavke} from "../../models/cmbStavke";
import {PosaoTip} from "../../models/PosaoTip";
import {PosaoServiceService} from "../../services/posao.service.service";
import {UserStoreService} from "../../services/user-store.service";
import {AuthService} from "../../services/auth.service";
import {PosaoVM} from "../../models/PosaoVM";
import {Router} from "@angular/router";
import { finalize } from 'rxjs/operators';
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;


@Component({
  selector: 'app-poslodavac-poslovi',
  templateUrl: './poslodavac-poslovi.component.html',
  styleUrls: ['./poslodavac-poslovi.component.css']
})
export class PoslodavacPosloviComponent {

  odabraniPosao!:any;

  forma!:FormGroup;
  tipKorisnika="poslodavac"
  posao:PosaoVM=new PosaoVM()



  // liste podataka iz baze

  poslovi:GetPosaoByUsernameVM[]=[];
  lokacije!:cmbStavke[]
  posaoTipovi!:PosaoTip[];
  nacinPlacanja!: cmbStavke[]
  dodatnoPlacanje!: cmbStavke[]
  rasporedi!:cmbStavke[]

  // za biranje rasporeda posla

  isMouseOverRaspored: boolean[] = [];
  selectedButtonRasporedPoslova: any[] = [];
  odabraniRasporedPosla: number[] = [];
  odabraniRasporedPoslaPreview: string[] = [];


  // za biranje lokacije posla
  filtiraneLokacije!:cmbStavke[]
  opstina_id:number=-2
  lokacija_id!:number

  // za biranje nacina placanja posla

  isMouseOverNacinPlacanja: boolean[] = [];
  selectedBtnNacinPlacanja=-1
  nacinPlacanja_id:number=0
  poDogovoru_id!:number
  btnPoDogovoru_id!:number

  // za biranje tipa posla

  filteredJobTitles: PosaoTip[] = [];
  posaoTip:any=''
  posaoTip_id:number=-2
  posaotipId!:number

  // za biranje dodatnog placanja za posla
  odabranoDodatno:number[]=[]
  odabranoDodatnoPreview:string[]=[]
  isMouseOverDodatno: boolean[] = [];
  selectedButtonDodatno: any[] = [];

  // za biranje broja ljudi za posla

  brojLjudi=["1","2","3","4","5","6","7","8","9","10","10+"]


  // za pregled aplikanata
  pogledajAplikante=true
  aplikanti:any[]=[]
  slikaPutanja="./assets/deafultUser.jpg"
  userSlika=""
  opcija=''
  // ocjena
  ocjena:number=0
  komentar=''
  ocjenaKomentar!:FormGroup
  odabraniAplikant!:any
  trenutniPosao!:any
  brojAplikanata!:any
  aplikantiNaslov=''
  ocjenjeniAplikanti!:any



  constructor(private datePipe: DatePipe,private mojConfig:MojConfig,private fb:FormBuilder,private posaoService:PosaoServiceService,
              private userStore:UserStoreService,private auth:AuthService,private router:Router) {
    this.filtiraneLokacije = [];
  }

  ngOnInit(){
    this.odabraniPosao=null;
    this.ucitajPoslove();
    this.forma=this.fb.group({
      naziv:['',Validators.required],
      lokacija:['',Validators.required],
      adresa:[''],
      vrijeme:[0],
      posaoTip:['',Validators.required],
      raspored:['',Validators.required],
      brojLjudi:['',Validators.required],
      opis:['',Validators.required],
      nacinPlacanja:['',],
      cijena:[0,Validators.required]
    });
    this.ocjenaKomentar=this.fb.group({
      ocjena:['',Validators.required],
      komentar:['',Validators.required],
      ocjenjujeUsername:[''],
      ocjenjeniUsername:[''],
      posao_id:[''],

    });
    this.mojConfig.getOpcineByDrzava(1).subscribe((r:any)=>{
      this.lokacije=r
    })
    this.mojConfig.getPosaoTipAll().subscribe((r:any)=>{
      this.posaoTipovi=r
    })
    this.mojConfig.getPitanjePonuđeniOdgovori(1).subscribe((r:any)=>{
      this.rasporedi=r



    })

    this.mojConfig.getPitanjePonuđeniOdgovori(2).subscribe((r:any)=>{
      this.nacinPlacanja=r
      this.pronađiBtnPoDogovoru();
      console.log('prvi')
      console.log(this.btnPoDogovoru_id);
    })
    this.mojConfig.getPitanjePonuđeniOdgovori(3).subscribe((r:any)=>{
      this.dodatnoPlacanje=r
    })


  }
  pronađiBtnPoDogovoru(){
    this.btnPoDogovoru_id=Number( this.nacinPlacanja.find(obj => obj.opis === 'po dogovoru')?.id);
  }

  ucitajPoslove(){
    let username=this.auth.getUserNameFromToken();
    this.mojConfig.getPosloveByUsername(username).subscribe((r:any)=>{
      this.poslovi=r
    })
  }
  getAplikanteByPosaoId(posaoId:number,brojAplikanata:number,opcija:string){
//GetOcjenjeneAplikanteByPosaoId
    //ocjenjivanje
    this.opcija=opcija;
    this.brojAplikanata=brojAplikanata;
    this.trenutniPosao=posaoId
    if(opcija==='ocjenjivanje'){
      this.mojConfig.GetOcjenjeneAplikanteByPosaoId(posaoId).subscribe((r:any)=>{
        this.ocjenjeniAplikanti=r
        if(brojAplikanata===this.ocjenjeniAplikanti.length && brojAplikanata===1)
          this.aplikantiNaslov='Ocijenili ste aplikanata sa kojim ste dogovorili posao.'
        if(brojAplikanata===this.ocjenjeniAplikanti.length && brojAplikanata>1)
          this.aplikantiNaslov='Ocijenili ste aplikanate sa kojima ste dogovorili posao.'
        else if(brojAplikanata==1)
          this.aplikantiNaslov='Izaberite aplikanata sa kojim ste dogovorili posao.'
        else{

          if(this.ocjenjeniAplikanti.length==0)
            this.aplikantiNaslov=`Izaberite ${brojAplikanata} aplikanata sa kojima ste dogovorili posao.`;
          else if(this.ocjenjeniAplikanti.length>0 && brojAplikanata-this.ocjenjeniAplikanti.length==1)
          {
            this.aplikantiNaslov=`Izaberite još ${brojAplikanata-this.ocjenjeniAplikanti.length} aplikanata sa kojim ste dogovorili posao.`;
          }
          else {
            this.aplikantiNaslov=`Izaberite još ${brojAplikanata-this.ocjenjeniAplikanti.length} aplikanata sa kojima ste dogovorili posao.`;
          }
        }


      })

    }
    else{
      this.aplikantiNaslov='Aplikanti'
    }





    this.mojConfig.GetAplikanteByPosaoId(posaoId).subscribe((r:any)=>{
      this.aplikanti=r
      this.aplikanti.forEach(aplikant => {
        this.initDojamUserSlika(aplikant.slika);
      });
    })
  }
  initFormu(){
    this.forma.get('naziv')?.setValue(this.odabraniPosao.naziv);
    this.forma.get('lokacija')?.setValue(this.odabraniPosao.opstina);
    this.forma.get('adresa')?.setValue(this.odabraniPosao.adresa);
    this.forma.get('posaoTip')?.setValue(this.odabraniPosao.posaoTip);
    this.forma.get('brojLjudi')?.setValue(this.odabraniPosao.brojRadnika);
    this.forma.get('opis')?.setValue(this.odabraniPosao.opis);
    this.forma.get('cijena')?.setValue(this.odabraniPosao.cijena);
    this.selectedButtonDodatno=this.odabraniPosao.dodatnoPlacanjeOdgovori;
    this.selectedButtonRasporedPoslova=this.odabraniPosao.rasporedOdgovori;
    this.forma.get('raspored')?.setValue(  this.selectedButtonRasporedPoslova[0]);
    this.selectedBtnNacinPlacanja=this.odabraniPosao.nacinPlacanja;


  }
  initDojamUserSlika(slika:any){
    this.userSlika= slika!==''?'data:image/jpeg;base64,'+slika:this.slikaPutanja
  }
  goToProfil(username:string){
    this.router.navigate(['profil'],{ queryParams: { username: username } })
  }
  formatirajDatum(datum: Date):any{
    return  this.datePipe.transform(datum, 'dd.MM.yyyy');
  }
  onInputChange(kontrola:string):void {
    if(kontrola==='opstine')
      this.filtiraneLokacije= this.lokacije.filter(l => l.opis.toLowerCase().startsWith(this.forma.get('lokacija')!.value.toLowerCase()));
    else
      this.filteredJobTitles= this.posaoTipovi.filter(
        pt => pt.naziv.toLowerCase().startsWith(this.forma.get('posaoTip')?.value.toLowerCase())
      );

  }

  onTitleSelected(posaoTip: any): void {
    this.forma.get('posaoTip')?.setValue(posaoTip.naziv);
    this.filteredJobTitles = [];
    this.posaoTip_id=posaoTip.id
  }
  onLocationSelected(l: any): void {
    this.forma.get('lokacija')!.setValue( l.opis);
    this.opstina_id=l.id
    this.filtiraneLokacije = [];
  }

  provjeriButton(r:any,kontorla:string) {
    if(kontorla==='raspored'){
      const index = this.selectedButtonRasporedPoslova.indexOf(r.id);

      if (index !== -1) {
        this.selectedButtonRasporedPoslova.splice(index, 1);
        this.odabraniRasporedPosla.splice(index, 1);
        this.odabraniRasporedPoslaPreview.splice(index, 1);
      } else {
        this.selectedButtonRasporedPoslova.push(r.id);
        this.odabraniRasporedPosla.push(r.id);
        this.odabraniRasporedPoslaPreview.push(r.opis);
        this.forma.get('raspored')?.setValue(r.id);
      }
      if(this.selectedButtonRasporedPoslova.length===0)
        this.forma.get('raspored')?.setValue(null);
    }
    else{
      const index = this.selectedButtonDodatno.indexOf(r.id);

      if (index !== -1) {
        this.selectedButtonDodatno.splice(index, 1);
        this.odabranoDodatno.splice(index, 1);
        this.odabranoDodatnoPreview.splice(index, 1);
      }
      else {
        this.selectedButtonDodatno.push(r.id);
        this.odabranoDodatno.push(r.id);
        this.odabranoDodatnoPreview.push(r.opis);
      }
    }
  }



  getIkonicaClass(i: number,kontorla:string) {
    if (kontorla === 'raspored')
      return this.selectedButtonRasporedPoslova.indexOf(i) !== -1 ? 'fa fa-check' : 'fa fa-plus';
    else
      return this.selectedButtonDodatno.indexOf(i) !== -1  ? 'fa fa-check' : 'fa fa-plus';
  }





  Uredi(job: GetPosaoByUsernameVM) {
    this.odabraniPosao=job;
    this.posaoService.posao_id=job.id;
    console.log(this.odabraniPosao);
    this.opstina_id=-2
    this.posaoTip_id=-2
    this.initFormu()
  }
  provjeriButtonNacinPlacanja(placanje:any) {

    this.forma.get('cijena')?.setValue(null);
    this.selectedBtnNacinPlacanja=placanje.id
    this.forma.get('nacinPlacanja')?.setValue(placanje.opis);
    this.nacinPlacanja_id=placanje.id
    if(placanje.opis==='po dogovoru') {
      this.forma.get('cijena')?.setValue(-2);
      this.poDogovoru_id=placanje.id;
    }
  }
  initPosaoService(){
    this.posaoService.naziv=this.forma.get('naziv')?.value;
    this.posaoService.adresa=this.forma.get('adresa')?.value;
    this.posaoService.opstina_id=this.opstina_id===-2?this.odabraniPosao.opstina_id:this.opstina_id;
    this.posaoService.posaoTip_id=this.posaoTip_id===-2?-1:this.posaoTip_id;
    if(this.posaoService.posaoTip_id===-1)
      this.posaoService.posaoTip=this.forma.get('posaoTip')?.value;
    this.posaoService.brojAplikanata=this.forma.get('brojLjudi')?.value;
    this.posaoService.opis=this.forma.get('opis')?.value;
    this.posaoService.cijena=this.forma.get('cijena')?.value;
    this.posaoService.radnoVrijeme=this.selectedButtonRasporedPoslova;
    this.posaoService.dodatnoPlacanje=this.selectedButtonDodatno;
    this.posaoService.vrstaPlacanja=this.selectedBtnNacinPlacanja;
    this.posaoService.deadline=this.forma.get('vrijeme')?.value;
    this.userStore.getUserName().subscribe(r=>{
      let rola=this.auth.getUserNameFromToken();
      this.posaoService.poslodavacUserName=r||rola;
    });
  }
  checkField(fieldName: string,forma:FormGroup): boolean {
    return forma.controls[fieldName].dirty && forma.hasError('required', fieldName)
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
  obrisi(){
    let posao_id=Number(this.odabraniPosao.id);
    this.mojConfig.deletePosaoById(posao_id).subscribe((r:any)=>{

      this.odabraniPosao=null;
      porukaSuccess("Uspješno obrisan posao.")

      this.ucitajPoslove();
    })
  }
  spremi(){
    if (this.forma.valid){


      this.initPosaoService()
      this.posao=this.posaoService
      this.mojConfig.updatePosao(this.posao).subscribe((r:any)=>{
        this.odabraniPosao=null;
        porukaSuccess("Uspješno spremljeni podaci. ")
        this.ucitajPoslove();
      })
    }
    else{
      this.validateAllFormFields(this.forma);
      porukaError("Molimo vas unesite odgovarajuće podatke");

    }


  }
  selectRating(ocjena:number){
    this.ocjenaKomentar.get('ocjena')?.setValue(ocjena) ;
    this.ocjena=ocjena;
  }
  ocijeni() {
    this.ocjenaKomentar.get('ocjenjujeUsername')?.setValue(this.auth.getUserNameFromToken());
    this.ocjenaKomentar.get('posao_id')?.setValue(this.trenutniPosao);

    this.ocjenaKomentar.get('ocjenjeniUsername')?.setValue(this.odabraniAplikant.username);
    if (this.ocjenaKomentar.valid) {

      this.mojConfig.addOcjenu(this.ocjenaKomentar.value).subscribe({
        next: (res: any) => {
          this.odabraniAplikant = null
          this.ocjenaKomentar.get('komentar')?.setValue('');
          this.ocjena=0;
          this.getAplikanteByPosaoId(this.trenutniPosao,this.brojAplikanata,this.opcija);
          porukaSuccess("Uspješno ocjenjen korisnik. ")


        },
        error: (err) => {
          porukaError("Molimo vas unesite odgovarajuće podatke");

        }
      });
    } else {
      this.validateAllFormFields(this.ocjenaKomentar);
      porukaError("Molimo vas unesite odgovarajuće podatke");


    }
  }
  jelOcjenjen(username:any){
    return this.ocjenjeniAplikanti.some((user:any) => user.username === username)

  }

  dodajPosao(){
    this.router.navigate(['osnovne-informacije'])
  }
  uredivanjeDatuma(datum :any):any {

    return datum.slice(0, 11);
  }
}
