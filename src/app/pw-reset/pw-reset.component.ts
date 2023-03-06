import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-pw-reset',
  templateUrl: './pw-reset.component.html',
  styleUrls: ['./pw-reset.component.css']
})
export class PwResetComponent {


  @ViewChild('pwreset') pwResetform: NgForm;
  
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService
    ) {}

  onSubmit(formCredentials: 
    { email: string, 
    }) {

    this.authService.resetPassword(formCredentials.email);
    //pw reset
  }

  onCancel() {
    this.navigationService.navigateHome()
  }

}
