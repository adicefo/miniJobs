import {Component, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ValidirajLozinke} from "../../helpers/Validator";
import {user} from "../../models/UserVM";
import {Router} from "@angular/router";
import {MojConfig} from "../../mojConfig";
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;




@Component({
  selector: 'app-nova-lozinka',
  templateUrl: './nova-lozinka.component.html',
  styleUrls: ['./nova-lozinka.component.css']
})
export class NovaLozinkaComponent {
  svrha:string="pristup podacima"; //svrha moze biti nova lozinka i pristup podacima
 email:string="";
 tipKorisnika:string="";
  type:string="password"

  forma!: FormGroup ;
  user:user=new user();

  obj:any;
  sadrziVelikoSlovo!:any
  sadrziMaloSlovo!:any
  sadrziBroj!:any
  sadrziSpecijalniZnak!:any
  sadrzi8karaktera!:any

  labelColor: string = '#666666';
  backgroundColor: string = '#cccccc';
  constructor(private fb:FormBuilder,public  router:Router,private mojConfig:MojConfig,
              private auth:AuthService,


  ) {
    this.email = "";
    this.tipKorisnika=this.auth.getRoleFromToken();
  }


  ngOnInit(): void {


    this.forma = this.fb.group({
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
      }
    )
  this.email="";
  }

  getKontrola (imeKontorle:string){
    return this.forma.get(imeKontorle);
  }

  provjeriKontrolu(imeKontorle:string){
    return  this.getKontrola(imeKontorle)?.['touched'] && this.getKontrola(imeKontorle)?.['dirty'];
  }

  provjeriPattern(): void {
    const lozinka = this.getKontrola('lozinka')?.value;
    const velikaSlova = new RegExp("[A-Z]");
    const malaSlova = new RegExp("[a-z]");
    const brojevi = new RegExp("[0-9]");
    const specijalniZnak = new RegExp("[!@#\$%\^&\*]");

    if (lozinka) {
      this.sadrziVelikoSlovo = velikaSlova.test(lozinka);
      this.sadrziMaloSlovo = malaSlova.test(lozinka);
      this.sadrziBroj = brojevi.test(lozinka);
      this.sadrziSpecijalniZnak = specijalniZnak.test(lozinka);
      this.sadrzi8karaktera = lozinka.length >= 8;
    }
  }


  checkField(fieldName: string): boolean {
    return this.forma.controls[fieldName].dirty && this.forma.hasError('required', fieldName)
  }
  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control=formGroup.get(field);
      if (control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }
      else if (control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }
  async getEmail() {
    this.user.username = this.auth.getUserNameFromToken();

    const response: any = await this.mojConfig.getUserByUsernameAndRole(this.user).toPromise();

    if (response && response.email)
      this.email = response.email;

  }

  async posalji() {
    if (this.email === "") {
      await this.getEmail();

    }

      if (this.forma.valid) {

        this.mojConfig.novaLozinka({novaLozinka: this.getKontrola("lozinka")?.value, email: this.email}).subscribe({
          next: (res: any) => {


            this.router.navigate(["login"]);
            porukaSuccess("Uspješno ste zamjenili lozinku.")


          },
          error: (err) => {
            porukaError("Molimo vas unesite odgovarajuće podatke");


          }
        });
     } else {
        this.validateAllFormFields(this.forma);
        porukaError("Molimo vas unesite odgovarajuće podatke");


      }

  }
  checkLozinkaPattern(){
    const lozinkaControl = this.getKontrola('lozinka');
    const hasPatternError = lozinkaControl?.hasError('pattern');
    return hasPatternError ;

  }
  isEmpty(){
    const lozinkaControl = this.getKontrola('lozinka');
    const lozinkaValue = lozinkaControl?.value;
    const isEmpty = lozinkaValue?.toString().trim().length === 0;

    return isEmpty;
  }
  jelSePodudaraju(){
    const lozinka=this.getKontrola('lozinka')?.value;
    const potvrdnaLozinka=this.getKontrola('potvrdiLozinku')?.value;
    return lozinka===potvrdnaLozinka;
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
  onMouseOver() {
    this.labelColor = '#e869dc';
    this.backgroundColor = '#e869dc';
  }

  onMouseOut() {
    this.labelColor = '#666666';
    this.backgroundColor = '#cccccc';
  }
  goToOsnovniPodaci(){
    this.router.navigate(['osnovniPodaci']);
  }

}
