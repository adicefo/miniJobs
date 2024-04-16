import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  odredeniPoslovi:any;
  constructor(private router:Router) {
  }
  onLogin(){
    this.router.navigate(['login']);
  }
  Registracija(){
    this.router.navigate(['registracija']);
  }
}
