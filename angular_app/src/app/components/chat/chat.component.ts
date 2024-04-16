import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MojConfig } from 'src/app/mojConfig';
import { AuthService } from 'src/app/services/auth.service';
import * as SignalR from '@aspnet/signalR';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() tipKorisnika: any = this.authService.getRoleFromToken().toLocaleLowerCase();

  pitanjeThread: any = null;
  poruke: any;

  pitanjeThreadCounter: number = 1;

  username: string = this.authService.getUserNameFromToken();
  sadrzaj: string = "";

  constructor(private authService: AuthService, private mojConfig: MojConfig, private http: HttpClient) {
    this.startConection();
  }

  ngOnInit() {

    this.http.get(this.mojConfig.adresaServera + "PitanjeThread/Get").subscribe(x => {
      this.pitanjeThread = x;
    });

    this.fetchPoruke();

  }
  conection = new SignalR.HubConnectionBuilder()
    .withUrl('https://localhost:44352/chat')
    .build();

  startConection() {
    this.conection.on("novaPoruka", (username: string, message: string, pitanjeThreadId: number) => {
      this.fetchPoruke();
    });
    this.conection.start();
  }


  getFiltriranoPoruke() {
    if (this.poruke == null)
      return [];

    return this.poruke.filter((x: any) =>
      x.pitanjeThread_id === this.pitanjeThreadCounter
    );
  }
  posaljiPoruku() {
    this.conection.send("PosaljiPoruku", this.username, this.sadrzaj, this.pitanjeThreadCounter)
      .then(() => {
        this.sadrzaj = "";
      });
  }

  fetchPoruke() {
    this.http.get(this.mojConfig.adresaServera + "Poruke/Get").subscribe(x => {
      this.poruke = x;
    });
  }



}


