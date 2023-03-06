import { AuthService } from './../services/auth.service';
import { Component, ViewChild } from '@angular/core';
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

  constructor(private authService: AuthService) {

  }


  onSignUp() {

    this.classValue = "right-panel-active"
    
  }


  onSignUpSubmit(formCredentials: 
    { email: string, 
      password: string
    }) {

      const credentials = { ...formCredentials }

      console.log('SignUp Hit')
      console.log('SignUp Credentials: ', credentials)

      console.log('Calling authService Sign Up Method')
      this.authService.signUp(credentials.email, credentials.password)
      console.log('Finished authService Sign Up Method')

    }

    onSignInSubmit(formCredentials: 
    { email: string, 
      password: string
    }) {


      console.log(formCredentials)
      const credentials = { ...formCredentials }

      console.log('SignIn Hit')
      console.log('SingIn credentials: ', credentials)

      console.log('Calling authService Sign In Method')
      this.authService.signIn(credentials.email, credentials.password)
      console.log('Finished authService Sign In Method')

      
    }

}
