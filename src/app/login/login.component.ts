import { AuthService } from './../services/auth.service';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('signIn') signInform: NgForm;

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService) {

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

    navigateToPasswordReset() {
      console.log('clicked')
      this.navigationService.navigateTo('pw-reset')
    }

    onCancel() {
      this.navigationService.navigateHome()
    }

}
