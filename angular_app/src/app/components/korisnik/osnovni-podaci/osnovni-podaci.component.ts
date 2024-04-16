import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { cmbStavke } from "../../../models/cmbStavke";
import { user } from "../../../models/UserVM";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MojConfig } from "../../../mojConfig";
import { AuthService } from "../../../services/auth.service";
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;

@Component({
  selector: 'app-osnovni-podaci',
  templateUrl: './osnovni-podaci.component.html',
  styleUrls: ['./osnovni-podaci.component.css']
})
export class OsnovniPodaciComponent {
  type: string = "password"
  forma!: FormGroup;
  formaAplikant!: FormGroup;
  slika!: any
  userObj!: any
  email: string = "";
  userIcon = './assets/deafultUser.jpg'
  ponuda!: any
  labelColor: string = '#666666';
  backgroundColor: string = '#cccccc';
  lokacije!: cmbStavke[]
  filtiraneLokacije!: cmbStavke[]
  opstina_id: any
  tipKorisnika = ""

  userVM: user = new user();

  //za brisanje racuna
  randomNumber!: any
  confirmNumber!: any
  obrisi!: any
  @ViewChild('locationInput') locationInput!: ElementRef; // Reference to the input element

  constructor(private fb: FormBuilder, private router: Router, private renderer: Renderer2,
    private mojConfig: MojConfig, private http: HttpClient, private auth: AuthService) {
    this.tipKorisnika = this.auth.getRoleFromToken();
  }

  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.locationInput.nativeElement.contains(event.target)) {
        this.hideLocationList();
      }
    });
    this.mojConfig.getOpcineByDrzava(1).subscribe(
      (r: any) => {
        this.lokacije = r
        this.filtiraneLokacije = [];
      });
    this.forma = this.fb.group({
      ime: ['', [
        Validators.required,
        Validators.pattern("^[A-ZŠĐČĆŽ ][a-zšđčćž ]+$"),
        Validators.minLength(3),
        Validators.maxLength(20)]],
      prezime: ['', [Validators.required,
      Validators.pattern("^[A-ZŠĐČĆŽ ][a-zšđčćž ]+$"),
      Validators.minLength(3),
      Validators.maxLength(30)]],
      korisnickoIme: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],


      nazivFirme: [''],
      email: [''],
      adresa: [''],
      brojTelefona: ['', [Validators.required, Validators.pattern(/^06[0-7]\d{6,7}$/)]],
      lokacija: ['', Validators.required],

    });
    this.formaAplikant = this.fb.group({
      ime: ['', [
        Validators.required,
        Validators.pattern("^[A-ZŠĐČĆŽ ][a-zšđčćž ]+$"),
        Validators.minLength(3),
        Validators.maxLength(20)]],
      prezime: ['', [Validators.required,
      Validators.pattern("^[A-ZŠĐČĆŽ ][a-zšđčćž ]+$"),
      Validators.minLength(3),
      Validators.maxLength(30)]],
      korisnickoIme: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      brojTelefona: ['', [Validators.pattern(/^06[0-7]\d{6,7}$/)]],
      lokacija: [''], email: [''],

    }

    );



    this.getUser();
    this.randomNumber = this.generateRandomNumber();

  }
  isEqual() {
    return this.randomNumber === this.confirmNumber;
  }
  obrisiProfil() {
    this.obrisi = false;
    let username = this.auth.getUserNameFromToken();
    this.mojConfig.obrisiKorisnickiNalog(username).subscribe((r: any) => {
      alert(r.message);
      this.router.navigate(['login']);

    });
  }
  generateRandomNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
  onListClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'li') {
      const selectedTitle = this.filtiraneLokacije.find((l) => l.opis === target.innerText);
      this.onTitleSelected(selectedTitle);
      this.hideLocationList();
    }
  }

  hideLocationList() {
    this.filtiraneLokacije = []; // Clear the filtered locations
  }
  getUser() {
    let username = this.auth.getUserNameFromToken()
    this.userVM.username = username;
    this.userVM.role = this.tipKorisnika;

    this.mojConfig.getUserByUsernameAndRole(this.userVM).subscribe((r: any) => {
      this.userObj = r;
      this.email = this.userObj.email;
      this.initFormu();
      this.ponuda = this.userObj.ponuda;
    });

  }
  azurirajPodatke() {
    if (this.tipKorisnika == 'Poslodavac') {
      if (this.forma.valid) {

        this.mojConfig.poslodavacUpdatePodatke(this.forma.value).subscribe({
          next: (res: any) => {

            alert(res.message);

            this.forma.reset();
            this.getUser();

          },
          error: (err) => {
            alert(err?.error.message)
          }
        });
      } else {
        //throw the error using toaster and with required fields
        this.validateAllFormFields(this.forma);
        alert("Forma nije validna!")
      }
    }
    else {
      if (this.formaAplikant.valid) {

        this.mojConfig.aplikantUpdatePodatke(this.formaAplikant.value).subscribe({
          next: (res: any) => {

           porukaSuccess("Uspješno ažurirani podaci.")

            this.forma.reset();
            this.getUser();

          },
          error: (err) => {
            porukaError("Molimo vas unesite odgovarajuće podatke");
          }
        });
      } else {
        //throw the error using toaster and with required fields
        this.validateAllFormFields(this.formaAplikant);
        porukaError("Molimo vas unesite odgovarajuće podatke");
      }
    }

  }
  updateDodatneInformacije() {
    let obj = {
      username: this.auth.getUserNameFromToken(),
      ponuda: this.ponuda,
      slika: this.slika != './assets/deafultUser.jpg' ? this.slika : ''
    };
    this.mojConfig.updateDodatneInformacije(obj).subscribe((r: any) => {
      porukaSuccess("Uspješno ažurirani podaci.")
    })
  }
  initFormu() {
    if (this.tipKorisnika == 'Poslodavac') {
      this.forma.get('lokacija')?.setValue(this.userObj.opstina);
      this.forma.get('adresa')?.setValue(this.userObj.adresa);
      this.forma.get('ime')?.setValue(this.userObj.ime);
      this.forma.get('prezime')?.setValue(this.userObj.prezime);
      this.forma.get('nazivFirme')?.setValue(this.userObj.nazivFirme);
      this.forma.get('brojTelefona')?.setValue(this.userObj.brojTelefona);
      this.forma.get('korisnickoIme')?.setValue(this.userObj.korisnickoIme);
      this.forma.get('email')?.setValue(this.email);
    }
    else {
      this.formaAplikant.get('lokacija')?.setValue(this.userObj.opstina_rodjenja?.description);
      this.formaAplikant.get('ime')?.setValue(this.userObj.ime);
      this.formaAplikant.get('prezime')?.setValue(this.userObj.prezime);
      this.formaAplikant.get('brojTelefona')?.setValue(this.userObj.brojTelefona);
      this.formaAplikant.get('korisnickoIme')?.setValue(this.userObj.korisnickoIme);
      this.formaAplikant.get('email')?.setValue(this.email);
    }
    this.slika = this.userObj.slika != '' && this.userObj.slika!=null ? 'data:image/jpeg;base64,' + this.userObj.slika : this.userIcon;
    this.ponuda = this.ponuda;

  }


  getKontrola(imeKontorle: string) {
    if (this.tipKorisnika == 'Poslodavac')
      return this.forma.get(imeKontorle);
    else
      return this.formaAplikant.get(imeKontorle);
  }

  provjeriKontrolu(imeKontorle: string) {
    return this.getKontrola(imeKontorle)?.['touched'] && this.getKontrola(imeKontorle)?.['dirty'];
  }


  checkField(fieldName: string): boolean {
    if (this.tipKorisnika == 'Poslodavac')
      return this.forma.controls[fieldName].dirty && this.forma.hasError('required', fieldName)
    else
      return this.formaAplikant.controls[fieldName].dirty && this.formaAplikant.hasError('required', fieldName)
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }
  checkPoljeIme(): string {
    let pattern = this.getKontrola('ime')?.getError('pattern');
    let minlength = this.getKontrola('ime')?.getError('minlength');
    let maxlength = this.getKontrola('ime')?.getError('maxlength');
    if (this.provjeriKontrolu('ime')) {
      if (pattern)
        return 'Ime mora da počinje sa velikim slovom i da se sastoji samo od malih slova.'
      if (minlength)
        return 'Ime mora da se sastoji od minimalno 3 slova.'
      if (maxlength)
        return 'Ime može da se sastoji od maksimalno 20 slova.'
    }
    return 'ne';
  }
  checkPoljePrezime(): string {
    let pattern = this.getKontrola('prezime')?.getError('pattern');
    let minlength = this.getKontrola('prezime')?.getError('minlength');
    let maxlength = this.getKontrola('prezime')?.getError('maxlength');
    if (this.provjeriKontrolu('prezime')) {
      if (pattern)
        return 'Prezime mora da počinje sa velikim slovom i da se sastoji samo od malih slova.'
      if (minlength)
        return 'Prezime mora da se sastoji od minimalno 3 slova.'
      if (maxlength)
        return 'Prezime može da se sastoji od maksimalno 30 slova.'
    }
    return 'ne';


  }
  checkPoljeKorisnickome(): string {
    let minlength = this.getKontrola('korisnickoIme')?.getError('minlength');
    let maxlength = this.getKontrola('korisnickoIme')?.getError('maxlength');
    if (this.provjeriKontrolu('korisnickoIme')) {

      if (minlength)
        return 'Korisničko ime mora da se sastoji od minimalno 6 karaktera.'
      if (maxlength)
        return 'Korisničko ime može da se sastoji od maksimalno 20 karaktera.'
    }
    return 'ne';


  }
  checkPoljeEmail(): string {
    let pattern = this.getKontrola('email')?.getError('pattern');
    if (this.provjeriKontrolu('email') && pattern)
      return 'Molimo Vas unesite validan email.'
    return 'ne';
  }
  checkPoljeBrojTelefona(): string {
    let pattern = this.getKontrola('brojTelefona')?.getError('pattern');
    const brojTelefonaControl = this.getKontrola('brojTelefona');
    if (brojTelefonaControl?.value) {
      const trimmedValue = brojTelefonaControl.value.trim(); // Trim the input value
      brojTelefonaControl.setValue(trimmedValue); // Update the control's value with the trimmed value
    }
    if (pattern && this.provjeriKontrolu('brojTelefona')) {
      return 'Molimo Vas unesite validan broj telefona.';
    }
    return '';
  }

  checkPoljeLozinka(): string {
    let pattern = this.getKontrola('lozinka')?.getError('pattern');
    let minlength = this.getKontrola('lozinka')?.getError('minlength');
    if (this.provjeriKontrolu('lozinka')) {
      if (pattern)
        return 'Lozinka treba da sadrži veliko i malo slovo, broj i specijalni znak.'
      if (minlength)
        return 'Lozinka mora da se sastoji od minimalno 8 karaktera.'
    }
    return 'ne';
  }

  onInputChange(): void {
    if (this.tipKorisnika == 'Poslodavac')
      this.filtiraneLokacije = this.lokacije.filter(l => l.opis.toLowerCase().startsWith(this.forma.get('lokacija')!.value.toLowerCase()));
    else this.filtiraneLokacije = this.lokacije.filter(l => l.opis.toLowerCase().startsWith(this.formaAplikant.get('lokacija')!.value.toLowerCase()));
  }

  onTitleSelected(l: any): void {
    if (this.tipKorisnika == 'Poslodavac')
      this.forma.get('lokacija')!.setValue(l.opis);
    else
      this.formaAplikant.get('lokacija')!.setValue(l.opis);
    this.opstina_id = l.id
    this.filtiraneLokacije = [];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageSrc: string = e.target.result;
      this.slika = imageSrc;
    };
    reader.readAsDataURL(file);
  }

  onFileChanged(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.slika = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  odjavi() {
    this.router.navigate(['login']);
  }
  onMouseOver() {
    this.labelColor = '#e869dc';
    this.backgroundColor = '#e869dc';
  }

  onMouseOut() {
    this.labelColor = '#666666';
    this.backgroundColor = '#cccccc';
  }

  goToNovaLozinka() {
    this.router.navigate(['nova-lozinka']);
  }
}
