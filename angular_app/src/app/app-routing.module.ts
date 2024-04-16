import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegistracijaComponent } from "./components/registracija/registracija.component";
import { HomeComponent } from "./components/home/home.component";
import { PoslodavacComponent } from "./components/poslodavac/poslodavac.component";
import { AplikantComponent } from "./components/aplikant/aplikant.component";
import { AuthGuard } from "./guards/auth.guard";
import { EmailVerifikacijaComponent } from "./components/email-verifikacija/email-verifikacija.component";
import { NovaLozinkaComponent } from "./components/nova-lozinka/nova-lozinka.component";
import { DetaljiPoslaComponent } from "./components/dodavanjePosla/detalji-posla/detalji-posla.component";
import {
  OsnovneInformacijeComponent
} from "./components/dodavanjePosla/osnovne-informacije/osnovne-informacije.component";
import { OpisPoslaComponent } from "./components/dodavanjePosla/opis-posla/opis-posla.component";
import { PreviewComponent } from "./components/dodavanjePosla/preview/preview.component";
import { PoslodavacPosloviComponent } from "./components/poslodavac-poslovi/poslodavac-poslovi.component";
import { SpremljeniPosloviComponent } from './components/poslovi/spremljeni-poslovi/spremljeni-poslovi.component';
import { PreporukaComponent } from './components/poslovi/preporuka/preporuka.component';
import { ProfilPoslodavacComponent } from "./components/poslodavac/profil-poslodavac/profil-poslodavac.component";
import { OsnovniPodaciComponent } from "./components/korisnik/osnovni-podaci/osnovni-podaci.component";
import {
  PoslodavacRegistracijaComponent
} from "./components/registracija/poslodavac-registracija/poslodavac-registracija.component";
import { RegistracijaMenuComponent } from "./components/registracija/registracija-menu/registracija-menu.component";
import { ChatComponent } from './components/chat/chat.component';
import {PosaoViewComponent} from "./components/posao-view/posao-view.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registracija-menu', component: RegistracijaMenuComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'email-verifikacija', component: EmailVerifikacijaComponent },
  { path: 'nova-lozinka', component: NovaLozinkaComponent },
  { path: 'vasiPoslovi', component: PoslodavacPosloviComponent },
  { path: 'poslodavac-registracija', component: PoslodavacRegistracijaComponent },
  { path: 'osnovniPodaci', component: OsnovniPodaciComponent },
  { path: 'profil', component: ProfilPoslodavacComponent },
  { path: 'posaoView', component: PosaoViewComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'detalji-posla', component: DetaljiPoslaComponent, canActivate: [AuthGuard],
    data: {
      role: "Poslodavac"
    }
  },
  {
    path: 'osnovne-informacije', component: OsnovneInformacijeComponent, canActivate: [AuthGuard],
    data: {
      role: "Poslodavac"
    }
  },
  {
    path: 'opis-placanje', component: OpisPoslaComponent, canActivate: [AuthGuard],
    data: {
      role: "Poslodavac"
    }
  },
  {
    path: 'preview', component: PreviewComponent, canActivate: [AuthGuard],
    data: {
      role: "Poslodavac"
    }
  },




  {
    path: 'poslodavac', component: PoslodavacComponent, canActivate: [AuthGuard],
    data: {
      role: "Poslodavac"
    }
  },
  {
    path: 'aplikant', component: AplikantComponent, canActivate: [AuthGuard],
    data: {
      role: "Aplikant"
    }
  },
  {
    path: 'spremljeni-poslovi', component: SpremljeniPosloviComponent, canActivate: [AuthGuard],
    data: {
      role: "Aplikant"
    }
  }, {
    path: 'preporuka', component: PreporukaComponent, canActivate: [AuthGuard],
    data: {
      role: "Aplikant"
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
