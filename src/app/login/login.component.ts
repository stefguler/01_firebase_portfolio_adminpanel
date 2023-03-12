import { AuthService } from './../services/auth.service';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('signUp') signUpform: NgForm;
  @ViewChild('signIn') signInform: NgForm;
  classValue;
  // email: string;
  // password: string;

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private renderer: Renderer2) {

  }


  onSignUp() {

    this.classValue = "right-panel-active"
    
  }


  onSignUpSubmit(formCredentials: 
    { email: string, 
      password: string
    }) {

      const credentials = { ...formCredentials }

      this.authService.signUp(credentials.email, credentials.password)


    }

    onSignInSubmit(formCredentials: 
    { email: string, 
      password: string
    }) {


      console.log(formCredentials)
      const credentials = { ...formCredentials }

      this.authService.signIn(credentials.email, credentials.password)


      
    }

}
