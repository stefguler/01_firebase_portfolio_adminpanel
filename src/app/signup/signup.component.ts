import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  token: string;

  constructor(private authService: AuthService,
    private navigationService: NavigationService) {
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

    onCancel() {
      this.navigationService.navigateHome()
    }

}
