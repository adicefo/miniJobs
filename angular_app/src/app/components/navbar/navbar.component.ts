import {Component, ViewChild} from '@angular/core';
import { Input } from '@angular/core';
import {Router} from "@angular/router";
import {UsermenuComponent} from "../usermenu/usermenu.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() tipKorisnika!:string;
  menuOpen=false;





  @ViewChild(UsermenuComponent) usermenu!: UsermenuComponent;

  onClickUserIcon() {

    this.usermenu.menuOpen= !this.usermenu.menuOpen;
    this.usermenu.userIcon=1;
  }

  constructor(public router:Router){

  }
  ngOnInit(){

  }
  postaviPosao(){
    this.router.navigate(['osnovne-informacije'])
  }
}
