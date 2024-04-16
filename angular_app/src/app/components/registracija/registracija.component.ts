import {Component, Input} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ValidirajLozinke} from "../../helpers/Validator";
import {MojConfig} from "../../mojConfig";
import {HttpClient} from "@angular/common/http";
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent {
  @Input() tipKorisnika!:string;

  type: string = "password"
  registracionForm!: FormGroup;
  email:string="";

  constructor(private fb: FormBuilder, private router: Router,private mojConfig:MojConfig,private http:HttpClient) {
  }

  ngOnInit(): void {
    this.registracionForm = this.fb.group({
        ime: ['', [
          Validators.required,
          Validators.pattern("^[A-ZŠĐČĆŽ ][a-zšđčćž ]+$"),
          Validators.minLength(3),
          Validators.maxLength(20)]],
        prezime: ['', [Validators.required,
          Validators.pattern("^[A-ZŠĐČĆŽ ][a-zšđčćž ]+$"),
          Validators.minLength(3),
          Validators.maxLength(30)]],
        email: ['', [Validators.required,  Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]],
        korisnickoIme: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20)
        ]],
        lozinka: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/
            ),
            Validators.minLength(8),
          ],

        ],
        potvrdiLozinku: ['', Validators.required],

      },
      {
        validator: [ValidirajLozinke('lozinka', 'potvrdiLozinku')]
        //   validators: this.potvrdaLozinke.bind(this)
      }
    )
  }





   getKontrola (imeKontorle:string){
    return this.registracionForm.get(imeKontorle);
  }

  provjeriKontrolu(imeKontorle:string){
    return  this.getKontrola(imeKontorle)?.['touched'] && this.getKontrola(imeKontorle)?.['dirty'];
  }
  Registracija() {
    if (this.registracionForm.valid) {

      this.mojConfig.registracija(this.registracionForm.value).subscribe({
        next: (res: any) => {


          // radi lakšeg testiranja ovo sam zakomentarisao
           this.email=this.getKontrola("email")?.value;
           this.router.navigate(["email-verifikacija",{ email: this.email, prethodnaAkcija:'registracija' }]);
           porukaSuccess("Uspješno ste se registrovali.")
          this.registracionForm.reset();
          //  nek odmah ide na login
         // this.router.navigate(['login']);

        },
        error: (err) => {
          porukaError("Molimo vas unesite odgovarajuće podatke");

        }
      });
    } else {
      this.validateAllFormFields(this.registracionForm);
      porukaError("Molimo vas unesite odgovarajuće podatke");


    }
  }

  checkField(fieldName: string): boolean {
    return this.registracionForm.controls[fieldName].dirty && this.registracionForm.hasError('required', fieldName)
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }
  checkPoljeIme():string{
    let pattern=this.getKontrola('ime')?.getError('pattern');
    let minlength=this.getKontrola('ime')?.getError('minlength');
    let maxlength=this.getKontrola('ime')?.getError('maxlength');
    if(this.provjeriKontrolu('ime') )
    {
      if(pattern)
        return  'Ime mora da počinje sa velikim slovom i da se sastoji samo od malih slova.'
      if(minlength)
        return 'Ime mora da se sastoji od minimalno 3 slova.'
      if(maxlength)
        return 'Ime može da se sastoji od maksimalno 20 slova.'
    }
    return 'ne';
  }
  checkPoljePrezime():string{
    let pattern=this.getKontrola('prezime')?.getError('pattern');
    let minlength=this.getKontrola('prezime')?.getError('minlength');
    let maxlength=this.getKontrola('prezime')?.getError('maxlength');
    if(this.provjeriKontrolu('prezime') )
    {
      if(pattern)
        return  'Prezime mora da počinje sa velikim slovom i da se sastoji samo od malih slova.'
      if(minlength)
        return 'Prezime mora da se sastoji od minimalno 3 slova.'
      if(maxlength)
        return 'Prezime može da se sastoji od maksimalno 30 slova.'
    }
    return 'ne';


  }
  checkPoljeKorisnickome():string{
    let minlength=this.getKontrola('korisnickoIme')?.getError('minlength');
    let maxlength=this.getKontrola('korisnickoIme')?.getError('maxlength');
    if(this.provjeriKontrolu('korisnickoIme') )
    {

      if(minlength)
        return 'Korisničko ime mora da se sastoji od minimalno 6 karaktera.'
      if(maxlength)
        return 'Korisničko ime može da se sastoji od maksimalno 20 karaktera.'
    }
    return 'ne';


  }
  checkPoljeEmail():string{
    let pattern=this.getKontrola('email')?.getError('pattern');
    if(this.provjeriKontrolu('email') && pattern )
        return 'Molimo Vas unesite validan email.'
    return 'ne';
  }
  checkPoljeLozinka():string{
    let pattern=this.getKontrola('lozinka')?.getError('pattern');
    let minlength=this.getKontrola('lozinka')?.getError('minlength');
    if(this.provjeriKontrolu('lozinka')  ){
      if(pattern)
        return  'Lozinka treba da sadrži veliko i malo slovo, broj i specijalni znak.'
      if(minlength)
        return 'Lozinka mora da se sastoji od minimalno 8 karaktera.'
    }
    return 'ne';
  }

}
