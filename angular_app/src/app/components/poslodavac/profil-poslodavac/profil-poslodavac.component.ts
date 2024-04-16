import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MojConfig } from "../../../mojConfig";
import { ProfilNavigacijaService } from "../../../services/profil-navigacija.service";
import { GetPosaoByUsernameVM } from "../../../models/getPosaoByUsernameVM";
import { AuthService } from "../../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { ProfilService } from "../../../services/profil.service";
import { cmbStavke } from "../../../models/cmbStavke";

@Component({
  selector: 'app-profil-poslodavac',
  templateUrl: './profil-poslodavac.component.html',
  styleUrls: ['./profil-poslodavac.component.css']
})
export class ProfilPoslodavacComponent {
  odabraniPosao: any = null
  isModalOpen = false;
  nacinPlacanja!: cmbStavke[]
  tipKorisnika = ''
  slikaPutanja = "./assets/deafultUser.jpg"
  userImage = ""
  dojamUserSlika = ""
  userName!: string // sto de prikazuje moze biti nazivFirme ili username

  user!: any
  username!: string // trenutnog Korisnika
  usernameProfil = "" // username od korisnika ciji profil gledamo
  tipKorisnikaProfil = "" // tip korisnika od korisnika ciji profil gledamo
  brojTelefona = "062 360 265"
  prikaziBrojTelefona!: any
  poslovi!: GetPosaoByUsernameVM[];
  odredeniPoslovi: GetPosaoByUsernameVM[] = [];

  odredeniPosloviCopy: GetPosaoByUsernameVM[] = []
  opcija: string = ""
  stranice: any[] = []
  brojStranica!: any
  trenutnaStranica!: any
  isMouseOverRaspored: boolean[] = [];
  aktivniPosloviList: GetPosaoByUsernameVM[] = [];
  zavrseniPosloviList: GetPosaoByUsernameVM[] = [];

  ponuda = "Naša kompanija nudi atraktivne mogućnosti za part-time poslove. Pružamo fleksibilno radno vrijeme koje se može prilagoditi vašim potrebama i rasporedu, omogućavajući vam da uskladite rad s drugim obvezama u životu. Osim toga, kao dio našeg tima, dobit ćete podršku i mogućnosti za osobni rast i razvoj unutar naše organizacije, uz priliku da steknete vrijedno iskustvo u odabranoj industriji."

  dojmoviList: any[] = []


  constructor(private auth: AuthService, private cdr: ChangeDetectorRef, private httpClient: HttpClient, private profileService: ProfilService,
    private route: ActivatedRoute, private mojConfig: MojConfig, private profilNavigacija: ProfilNavigacijaService) {
    this.username = this.auth.getUserNameFromToken()
    this.tipKorisnika = this.auth.getRoleFromToken()
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.usernameProfil = params['username'];
      if (!this.usernameProfil)
        this.usernameProfil = this.username
      this.mojConfig.GetProfilByUsername(this.usernameProfil).subscribe((r: any) => {
        this.user = r
        this.initUserData();
        if (this.tipKorisnikaProfil == 'Poslodavac') {
          this.mojConfig.getPosloveByUsername(this.usernameProfil).subscribe((r: any) => {
            this.poslovi = r
            this.aktivniPosloviList = this.poslovi.filter(
              (posao: GetPosaoByUsernameVM) => posao.status === 'Aktivan'
            );
            this.zavrseniPosloviList = this.poslovi.filter(
              (posao: GetPosaoByUsernameVM) => posao.status === 'Završen'
            );
          })
        }
        else {
          this.mojConfig.GetAplikantZavrsenePosloveByUsername(this.usernameProfil).subscribe((r: any) => {
            this.zavrseniPosloviList = r

          })
        }

      })

    });

    this.mojConfig.GetDojmoveByUsername(this.usernameProfil).subscribe((r: any) => {
      this.dojmoviList = r
      this.dojmoviList.forEach(dojam => {
        this.initDojamUserSlika(dojam.slika);
      });

    })
    this.profilNavigacija.data$.subscribe((opcija) => {
      this.opcija = opcija;
      this.trenutnaStranica = 1;
      this.straniceInit(this.opcija);
    });
    this.prikaziBrojTelefona = false;

    this.mojConfig.getPitanjePonuđeniOdgovori(2).subscribe(
      (r: any) => {
        this.nacinPlacanja = r
      })


  }

    initDojamUserSlika(slika: any) {
    this.dojamUserSlika = slika !== '' ? 'data:image/jpeg;base64,' + slika : this.slikaPutanja
  }
  initUserData() {
    this.userImage =  this.user.slika!=null && this.user.slika!="" ? 'data:image/jpeg;base64,' + this.user.slika : this.slikaPutanja
    this.profileService.tipKorisnika = this.usernameProfil == this.username ? this.tipKorisnika : this.user.tipKorisnika;
    this.tipKorisnikaProfil = this.profileService.tipKorisnika;
    if (this.tipKorisnikaProfil == 'Poslodavac')
    {
      if(this.usernameProfil)
      this.user.nazivFirme != '' &&  this.user.nazivFirme != null ? this.userName = this.user.nazivFirme : this.userName = this.usernameProfil
      else
        this.user.nazivFirme != ''&& this.user.nazivFirme != null ? this.userName = this.user.nazivFirme : this.userName = this.username
    }
    else{
      if(this.usernameProfil)
        this.userName = this.usernameProfil
      else
        this.userName=this.username
    }



  }
  straniceInit(opcija: string) {
    this.stranice = [];
    this.trenutnaStranica = 1;
    if (opcija === 'aktivni')
      this.odredeniPoslovi = this.aktivniPosloviList;
    else {
      this.odredeniPoslovi = this.zavrseniPosloviList;
    }
    let temp = this.odredeniPoslovi.length / 6;
    this.brojStranica = parseInt(temp.toString(), 10);
    for (let i = 1; i <= this.brojStranica + 1; i++) {
      this.stranice.push(i);
    }
  }
  ProvjeriContent(): number {
    if (this.opcija === 'aktivni' && this.tipKorisnikaProfil == 'Poslodavac') {
      if (this.trenutnaStranica === 1)
        this.odredeniPosloviCopy = this.aktivniPosloviList.slice(0, 6);
      return 1;
    }

    if (this.opcija === 'zavrseni') {

      if (this.trenutnaStranica === 1)
        this.odredeniPosloviCopy = this.zavrseniPosloviList.slice(0, 6);
      return 2;
    }
    if (this.opcija === 'aktivni' && this.tipKorisnikaProfil == 'Aplikant') {

      return 4;
    }
    return 3;

  }
  ProvjeriInformacije() {
    return (this.user.opis == null || this.user.opis == '') && (this.user.posaoTip == null || this.user.posaoTip == '') &&
      (this.user.iskustvo == null || this.user.iskustvo == '') && (this.user.nivoObrazovanja == null || this.user.nivoObrazovanja == '') &&
      (this.user.prijedlogSatince == null || this.user.prijedlogSatince == '');
  }
  naprijed() {
    this.trenutnaStranica = this.trenutnaStranica + 1
    if (this.opcija === 'aktivni') {
      if (this.trenutnaStranica === this.brojStranica + 1)
        this.odredeniPosloviCopy = this.aktivniPosloviList.slice(this.brojStranica * 6)
      else {
        this.odredeniPosloviCopy = this.aktivniPosloviList.slice((this.trenutnaStranica - 1) * 6, this.trenutnaStranica * 6)
      }
    }
    else {
      if (this.trenutnaStranica === this.brojStranica + 1)
        this.odredeniPosloviCopy = this.zavrseniPosloviList.slice(this.brojStranica * 6)
      else {
        this.odredeniPosloviCopy = this.zavrseniPosloviList.slice((this.trenutnaStranica - 1) * 6, this.trenutnaStranica * 6)
      }
    }



  }
  nazad() {
    this.trenutnaStranica = this.trenutnaStranica - 1
    if (this.opcija === 'aktivni')
      this.odredeniPosloviCopy = this.aktivniPosloviList.slice((this.trenutnaStranica - 1) * 6, this.trenutnaStranica * 6)
    else
      this.odredeniPosloviCopy = this.zavrseniPosloviList.slice((this.trenutnaStranica - 1) * 6, this.trenutnaStranica * 6)
  }
  pomjeri(brStranice: any) {
    this.isMouseOverRaspored[brStranice - 1] = false
    this.trenutnaStranica = brStranice
    if (this.opcija === 'aktivni')
      this.odredeniPosloviCopy = this.aktivniPosloviList.slice((this.trenutnaStranica - 1) * 6, this.trenutnaStranica * 6)
    else
      this.odredeniPosloviCopy = this.zavrseniPosloviList.slice((this.trenutnaStranica - 1) * 6, this.trenutnaStranica * 6)
  }
  prikaziBroj() {
    const div: HTMLDivElement | null = document.querySelector('.brojTelefona');

    if (this.prikaziBrojTelefona) {
      this.prikaziBrojTelefona = false;
      div?.classList.remove('show');
    } else {
      this.prikaziBrojTelefona = true;
      div?.classList.add('show');
    }



  }
  pogledajPosao(posaoObj: any) {

    this.odabraniPosao = posaoObj;
    this.isModalOpen = true;
  }
  handleModalClosed() {

    this.isModalOpen = false;
  }
  posaonacinPlacanja(posao: any): any {

    return this.nacinPlacanja.find(stavka => stavka.id === posao.nacinPlacanja)?.opis;


  }
}
