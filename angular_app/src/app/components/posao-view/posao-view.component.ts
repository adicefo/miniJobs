import {Component, EventEmitter, Input,Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MojConfig} from "../../mojConfig";
import {UserStoreService} from "../../services/user-store.service";
import {PosaoServiceService} from "../../services/posao.service.service";
import {PosaoPreviewServiceService} from "../../services/posao-preview.service.service";
import {AuthService} from "../../services/auth.service";
import {cmbStavke} from "../../models/cmbStavke";
import {HttpClient} from "@angular/common/http";
declare function porukaSuccess(m: string): any;
declare function porukaError(error: any): any;
@Component({
  selector: 'app-posao-view',
  templateUrl: './posao-view.component.html',
  styleUrls: ['./posao-view.component.css']
})
export class PosaoViewComponent {
  @Input() posao!: any;
  @Input() isModalOpen !: any;
  postavi!:any
  nacinPlacanja!: cmbStavke[]
  dodatnoPlacanje!: cmbStavke[]
  rasporedPosla!: cmbStavke[]
  tipKorisnika!:any
  public novoApliciranje: any;
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();


  closeModal() {
    this.modalClosed.emit();
  }


  constructor(private fb: FormBuilder, public router: Router, private sanitizer: DomSanitizer, private mojConfig: MojConfig
    , private userStore: UserStoreService, private posaoService: PosaoServiceService,
              private posaoPreviewService: PosaoPreviewServiceService, private auth: AuthService, private httpClient: HttpClient) {
  }

  ngOnInit() {


    this.mojConfig.getPitanjePonuđeniOdgovori(2).subscribe(
      (r: any) => {
        this.nacinPlacanja = r
      })
    this.mojConfig.getPitanjePonuđeniOdgovori(3).subscribe(
      (r: any) => {
        this.dodatnoPlacanje = r
      })
    this.mojConfig.getPitanjePonuđeniOdgovori(1).subscribe(
      (r: any) => {
        this.rasporedPosla = r
      })

  }

  ngOnChanges() {
    this.InitFields();
  }

  InitFields() {
    if (this.posao) {
      this.tipKorisnika=this.auth.getRoleFromToken();
      let nacinPlacanjaObj = this.nacinPlacanja.find(stavka => stavka.id === this.posao.nacinPlacanja);
      this.posao.nacinPlacanjacopy = nacinPlacanjaObj?.opis;
      if (this.posao.dodatnoPlacanja) {
        const selectedStavke = this.dodatnoPlacanje.filter(stavka => this.posao.dodatnoPlacanja.includes(parseInt(stavka.id)));
        this.posao.dodatnoPlacanjacopy = selectedStavke.map(stavka => stavka.opis);
      }
      const rasporedStavke = this.rasporedPosla.filter(stavka => this.posao.rasporedOdgovori.includes(parseInt(stavka.id)));
      this.posao.rasporedOdgovoricopy = rasporedStavke.map(stavka => stavka.opis);

    }
    this.posao.deadline=this.uredivanjeDatuma(this.posao.deadline);
  }
  uredivanjeDatuma(datum :any):any {

    return datum.slice(0, 11);
  }

  pripremiPostavljanje() {
    this.postavi = {
      datum_kreiranja: '2023-04-09T00:30:59.456Z', //radi errora probno
      naziv: "",
      posao_id: this.posao.id
    }
  }
  postaviPitanje() {
    this.httpClient.post(this.mojConfig.adresaServera + "PitanjeThread/Add", this.postavi).subscribe(x => {
      this.postavi = null;
      porukaSuccess("Pitanje uspješno postavljeno " )
    });
  }
  spremiPosao() {
    let aplikant
    let user={
      username:this.auth.getUserNameFromToken(),
      role:this.auth.getRoleFromToken()
    }
    this.mojConfig.getUserByUsernameAndRole(user).subscribe((r: any) => {
      aplikant = r;
    this.novoApliciranje = {
      status: 0,
      posao_id: this.posao.id,
      aplikant_id: aplikant.id
    };
    this.httpClient.post(this.mojConfig.adresaServera + "SpremljeniPosao/Add", this.novoApliciranje).subscribe(x => {
      porukaSuccess("Posao uspješno spremljen ")
    }, (error) => {
      porukaError("Oglas već zapremljen");
    });
    });
  }
  apliciraj() {
    let aplikant
    let user={
      username:this.auth.getUserNameFromToken(),
      role:this.auth.getRoleFromToken()
    }
    this.mojConfig.getUserByUsernameAndRole(user).subscribe((r: any) => {
      aplikant = r;
      this.novoApliciranje = {
        status: "",
        datum_apliciranja: '2023-04-09T00:30:59.456Z', //radi errora probno
        posao_id: this.posao.id,
        aplikant_id: aplikant.id
      };
      this.httpClient.post(this.mojConfig.adresaServera + "ApliciraniPosao/Add", this.novoApliciranje).subscribe(x => {
        porukaSuccess("Uspješno ste aplicirali " +this.auth.getUserNameFromToken())
      }, (error) => {
        porukaError("Aplicirali ste na postojeći oglas");
      });
      ;



    });

  }
}
