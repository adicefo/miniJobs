import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegistracijaComponent } from './components/registracija/registracija.component';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AplikantComponent } from './components/aplikant/aplikant.component';
import { PoslodavacComponent } from './components/poslodavac/poslodavac.component';
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContentComponent } from './components/content/content.component';
import { EmailVerifikacijaComponent } from './components/email-verifikacija/email-verifikacija.component';
import { NovaLozinkaComponent } from './components/nova-lozinka/nova-lozinka.component';
import { DetaljiPoslaComponent } from './components/dodavanjePosla/detalji-posla/detalji-posla.component';
import { OsnovneInformacijeComponent } from './components/dodavanjePosla/osnovne-informacije/osnovne-informacije.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { OpisPoslaComponent } from './components/dodavanjePosla/opis-posla/opis-posla.component';
import { PreviewComponent } from './components/dodavanjePosla/preview/preview.component';
import { PoslodavacPosloviComponent } from './components/poslodavac-poslovi/poslodavac-poslovi.component';
import { DatePipe } from "@angular/common";
import { SpremljeniPosloviComponent } from './components/poslovi/spremljeni-poslovi/spremljeni-poslovi.component';
import { PreporukaComponent } from './components/poslovi/preporuka/preporuka.component';
import { ProfilPoslodavacComponent } from './components/poslodavac/profil-poslodavac/profil-poslodavac.component';

import { NavbarProfilComponent } from './components/poslodavac/profil-poslodavac/navbar-profil/navbar-profil.component';
import { UsermenuComponent } from './components/usermenu/usermenu.component';
import { OsnovniPodaciComponent } from './components/korisnik/osnovni-podaci/osnovni-podaci.component';
import { PoslodavacRegistracijaComponent } from './components/registracija/poslodavac-registracija/poslodavac-registracija.component';
import { RegistracijaMenuComponent } from './components/registracija/registracija-menu/registracija-menu.component';
import { ChatComponent } from './components/chat/chat.component';
import { PosaoViewComponent } from './components/posao-view/posao-view.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistracijaComponent,
    HomeComponent,
    AplikantComponent,
    PoslodavacComponent,
    FooterComponent,
    NavbarComponent,
    ContentComponent,
    EmailVerifikacijaComponent,
    NovaLozinkaComponent,
    DetaljiPoslaComponent,
    OsnovneInformacijeComponent,
    OpisPoslaComponent,
    PreviewComponent,
    PoslodavacPosloviComponent,
    SpremljeniPosloviComponent,
    PreporukaComponent,
    ProfilPoslodavacComponent,
    NavbarProfilComponent,
    UsermenuComponent,
    OsnovniPodaciComponent,
    PoslodavacRegistracijaComponent,
    RegistracijaMenuComponent,
    ChatComponent,
    PosaoViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CKEditorModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
