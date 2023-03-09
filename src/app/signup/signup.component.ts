import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  token: string;
  message: string;
  login_result: boolean;
  @ViewChild('signUp') signUp: NgForm;

  constructor(private authService: AuthService,
    private navigationService: NavigationService) {
  }


  onSignUpSubmit(formCredentials:
    {
      email: string,
      password: string
    }) {

    const credentials = { ...formCredentials }

    console.log('Calling authService Sign Up Method')

    // this.authService.signUp(credentials.email, credentials.password)
    this.authService.signUp(credentials.email, credentials.password)
      .subscribe((authResult) => {

        
        if (authResult.result) {
          this.login_result = true;
          this.message = `:) \n 
            ! Sign Up successfull !
            Welcome ${formCredentials.email}! You can now sign-in as admin to this page.\n `;
          this.signUp.reset()

        } else {
          this.login_result = false;
          let errorMessage: string;

          if (authResult.message.toString().includes("FirebaseError: Firebase: ")) {
              errorMessage = authResult.message.toString().replace("FirebaseError: Firebase: ", "")
          } else {
            errorMessage = authResult.message.toString();
          }
          this.message = ` :( \n
            ! Sign Up failed !
            ${errorMessage} \n 
            :( `;
          this.signUp.reset()
        }

       });
  }

  onCancel() {
    this.navigationService.navigateHome()
  }

  closeInfoBox() {
    this.message = '';
    this.login_result ? this.navigationService.navigateTo('login') : null;
  }

}
