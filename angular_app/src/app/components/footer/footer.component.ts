import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() tipKorisnika:string="aplikant";
  @Input() top:number=0;
  daVidimo!:any

  jelAplikant:boolean=this.tipKorisnika==='aplikant';
}
