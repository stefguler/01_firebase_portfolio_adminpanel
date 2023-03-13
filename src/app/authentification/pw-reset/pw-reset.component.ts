import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-pw-reset',
  templateUrl: './pw-reset.component.html',
  styleUrls: ['./pw-reset.component.css']
})
export class PwResetComponent {


  @ViewChild('pwreset') pwResetform: NgForm;
  message: string;
  login_result: boolean;
  
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService
    ) {}

    onPasswordResetSubmit(formCredentials:
      {
        email: string
      }) {
  
      const credentials = { ...formCredentials }
  
      this.authService.resetPassword(formCredentials.email)
        .subscribe((authResult) => {          
        
        if (authResult.result) {
          this.login_result = true;
          this.message = `:) \n 
            ! Password reset successfull !
            You shall have received instructions to reset your password to: ${formCredentials.email}!`;
          this.pwResetform.reset()

        } else {
          this.login_result = false;
          let errorMessage: string;

          if (authResult.message.toString().includes("FirebaseError: Firebase: ")) {
              errorMessage = authResult.message.toString().replace("FirebaseError: Firebase: ", "")
          } else {
            errorMessage = authResult.message.toString();
          }
          this.message = ` :( \n
            ! Password reset failed !
            ${errorMessage} \n 
            :( `;
          this.pwResetform.reset()
        }

       });
    }

  closeInfoBox() {
    this.message = '';
    this.login_result ? this.navigationService.navigateTo('login') : null;
  }

  onCancel() {
    this.navigationService.navigateHome()
  }

}
