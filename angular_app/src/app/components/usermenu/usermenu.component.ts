import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-usermenu',
  templateUrl: './usermenu.component.html',
  styleUrls: ['./usermenu.component.css']
})
export class UsermenuComponent {
  @Input() menuOpen!: boolean;
  @Input() userIcon: any;
  tipKorisnika:any;
  private nativeElement: Node;

  constructor(private elementRef: ElementRef,private router:Router,private  auth:AuthService) {
    this.nativeElement = elementRef.nativeElement;
    this.menuOpen = false;
    this.tipKorisnika=this.auth.getRoleFromToken()
  }

  ngOnInit() {

  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {

    const clickedInside = this.nativeElement.contains(event.target as Node);
    if (!clickedInside && this.userIcon!==1) {
      this.menuOpen = false;
    }

    this.userIcon=0;

  }
  goToOsnovniPodaci(){

    this.router.navigate(['osnovniPodaci']);
  }
  goToNovaLozinka(){
    this.router.navigate(['nova-lozinka']);
  }
}
