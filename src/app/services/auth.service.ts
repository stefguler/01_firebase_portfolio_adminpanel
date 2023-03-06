import { NavigationService } from './navigation.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, of, take, switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private navigateService: NavigationService) { }

    


  signUp(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        // Handle successful sign-up
        this.navigateService.navigateTo('admin')
      })
      .catch(error => {
        // Handle sign-up error
        console.log(`sign up error as: ${error}`)
      });
  }

  signIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        // Handle successful sign-in
        console.log('res', res)
        this.navigateService.navigateTo('admin')

      })
      .catch(error => {
        // Handle sign-in error
        console.log(`sign in error as: ${error}`)
      });
  }

  signOut() {
    this.auth.signOut()
      .then(() => {
        // Handle successful sign-out
        this.navigateService.navigateTo('')
        alert('You have successfully been logged out')
      })
      .catch(error => {
        // Handle sign-out error
        console.log(`sign out error as: ${error}`)
      });
  }

  resetPassword(email: string) {
    this.auth.sendPasswordResetEmail(email)
      .then(() => {
        // Handle successful password reset email sent
        this.navigateService.navigateTo('login')
      })
      .catch(error => {
        // Handle password reset email sending error
        console.log(`password reset error as: ${error}`)
      });
  }

  getIdToken(): Observable<string> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log("user: ", user)
          return from(user.getIdToken());
        } else {
          return of(null);
        }
      })
    );
  }

}
