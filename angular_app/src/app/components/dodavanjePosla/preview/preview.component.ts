import {Component, ElementRef, ViewChild} from '@angular/core';
import {PosaoVM} from "../../../models/PosaoVM";
import {ActivatedRoute, Router} from "@angular/router";
import {PosaoPreview} from "../../../models/PosaoPreview";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PosaoServiceService} from "../../../services/posao.service.service";
import {PosaoPreviewServiceService} from "../../../services/posao-preview.service.service";
import {MojConfig} from "../../../mojConfig";
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent {
  logo='./assets/preview.jfif'
  tipKorisnika="poslodavac"
  posao:PosaoVM=new PosaoVM()
  sanitizedOpis!: SafeHtml;
  posaoPreview:PosaoPreview=new PosaoPreview()
  opis:any
  @ViewChild('opisContainer', { static: true }) opisContainer!: ElementRef;
 constructor(private sanitizer: DomSanitizer,private route:ActivatedRoute,private router:Router,
             private posaoService:PosaoServiceService,
             public posaoPreviewService:PosaoPreviewServiceService,private mojConfig:MojConfig) {
 }
 ngOnInit(){
   /*this.route.params.subscribe((r) => {
     let posao = JSON.parse(r['posao']);
     let posaoPreview = JSON.parse(r['posaoPreview']);
     this.posaoPreview = posaoPreview;
     this.opis =posaoPreview.opis;
     this.renderOpis();
     this.posao = posao;
     this.sanitizedOpis = this.sanitizer.bypassSecurityTrustHtml(this.opis);
   });*/
 }
  private renderOpis() {
    this.opisContainer.nativeElement.innerHTML = this.opis;
  }
  goBack(){
   this.router.navigate(['opis-placanje'])
  }

  PostaviPosao(){
    this.posaoService.poslodavacUserName=this.posaoPreviewService.poslodavac;
    this.posao=this.posaoService
    this.mojConfig.addPosao(this.posao).subscribe((r:any)=>{
      this.router.navigate(['vasiPoslovi'])
      porukaSuccess("Uspješno ste postavili posao.")
    },(error)=>{
      porukaError("Molimo vas unesite odgovarajuće podatke");
    });

  }
}
