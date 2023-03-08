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
  message: string = ``;
  login_result: boolean;

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService) {

  }


  onSignInSubmit(formCredentials:
    {
      email: string,
      password: string
    }) {

    const credentials = { ...formCredentials }

    this.authService.signIn(formCredentials.email, formCredentials.password)
      .subscribe((isSignedIn) => {
        if (isSignedIn) {
          this.login_result = true;
          this.message = `:) \n 
            ! Login successfull !
            Welcome ${formCredentials.email}! \n `;
          this.signInform.reset()
          
        } else {
          this.login_result = false;
          this.message = ` :( \n
            ! Login failed !
            Unfortunately the email: "${formCredentials.email}" or password is not known to the database. Please try again!`;
          this.signInform.reset()
        }
      });
  }



  closeInfoBox() {
    this.message = '';
    this.login_result ? this.navigationService.navigateHome() : null;
  }


  navigateToPasswordReset() {
    console.log('clicked')
    this.navigationService.navigateTo('pw-reset')
  }

  onCancel() {
    this.navigationService.navigateHome()
  }

}
