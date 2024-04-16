import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {Router} from "@angular/router";
import {MojConfig} from "../../mojConfig";
import {AuthService} from "../../services/auth.service";
import {UserStoreService} from "../../services/user-store.service";
import {user} from "../../models/UserVM";
import {PrivremeniAuthService} from "../../services/privremeni-auth.service";
declare function porukaSuccess(m:string): any;
declare function porukaError(error: any):any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  type:string="password"
  isText:boolean=false
  eyeIcon:string="fa-eye-slash"
  loginForm!: FormGroup ;
  email:string="";
  user:user=new user();
  constructor(private fb:FormBuilder,private  router:Router,private mojConfig:MojConfig,
              private privremeniAuth:PrivremeniAuthService,private auth:AuthService,
              private userStore:UserStoreService
              ) { }


  ngOnInit(): void {

    this.loginForm=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]

    })
  }
  hideShowPass(){
    this.isText=!this.isText;
    this.isText?this.eyeIcon="fa-eye": this.eyeIcon="fa-eye-slash";
    this.isText?this.type="text": this.type="password";

  }

  onLogin(){
    if (this.loginForm.valid) {
      this.mojConfig.login(this.loginForm.value).subscribe({
        next:(res:any)=>{

          this.loginForm.reset();
          this.auth.spremiToken(res.accessToken);
          this.privremeniAuth.token=res.accessToken;
          this.auth.spremiRefreshToken(res.refreshToken);
          this.privremeniAuth.refreshtoken=res.refreshToken
          let korisnikEmail=res.email
          const tokenPayload=this.auth.decodeToken();
          this.auth.spremiToken('');
          this.auth.spremiRefreshToken('');

          this.userStore.setUserName(tokenPayload.unique_name);
          this.userStore.setRole(tokenPayload.role);

          this.router.navigate(["email-verifikacija", { email:korisnikEmail, prethodnaAkcija: 'login' }]);
        },
        error:(err)=>{
          porukaError("Pogrešno korisničko ime ili lozinka");

        }
      });
    }
    else
    {
      this.validateAllFormFields(this.loginForm);
      porukaError("Molimo vas unesite odgovarajuće podatke");
    }
  }
  checkField(fieldName:string):boolean{
    return this.loginForm.controls[fieldName].dirty && this.loginForm.hasError('required',fieldName)
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
  sendCode() {
    this.mojConfig.resendverifikacijaEmaila(this.email).subscribe((r:any)=>{
      alert(r.message);
    })
  }
  zaboravljenaLozinka(username:string) {
    if(this.loginForm.get("username")?.valid){
      this.user.username=username;

      this.mojConfig.getUserByUsernameAndRole(this.user).subscribe((r: any) => {
        this.email = r.email;
        this.sendCode();
        this.router.navigate(["email-verifikacija", {email: this.email, prethodnaAkcija: 'login'}]);

      });
    }
    else{
      this.loginForm.get("username")?.markAsDirty({onlySelf:true});
    }

  }
}
