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
  message: string = ``;
  login_result: boolean;

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
    this.navigationService.navigateTo('pw-reset')
  }

  onCancel() {
    this.navigationService.navigateHome()
  }

}
