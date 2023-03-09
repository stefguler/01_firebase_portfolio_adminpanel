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
      .subscribe((authResult) => {



        if (authResult.result) {
          this.login_result = true;
          this.message = `:) \n 
            ! Login successfull !
            Welcome ${formCredentials.email}! \n `;
          this.signInform.reset()

        } else {
          this.login_result = false;
          let errorMessage: string;

          if (authResult.message.toString().includes("FirebaseError: Firebase: ")) {
              errorMessage = authResult.message.toString().replace("FirebaseError: Firebase: ", "")
          } else {
            errorMessage = authResult.message.toString();
          }
          this.message = ` :( \n
            ! Login failed !
            ${errorMessage} \n 
            :( `;
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
