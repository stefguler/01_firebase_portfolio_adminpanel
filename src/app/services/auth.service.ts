import { NavigationService } from './navigation.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
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
    .then(() => {
      // Handle successful sign-in
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
      })
      .catch(error => {
        // Handle password reset email sending error
        console.log(`password reset error as: ${error}`)
      });
  }

  getAuthToken(): Observable<string> {
    return this.auth.authState.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return from(user.getIdToken());
        }
        return of(null);
      })
    );
  }


}
