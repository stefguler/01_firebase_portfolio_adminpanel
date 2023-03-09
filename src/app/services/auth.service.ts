import { NavigationService } from './navigation.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, of, switchMap, Observable, map, catchError } from 'rxjs';
import { authResult } from '../models/authResult';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authResult: authResult = {
    result: false,
    message: ''
  }

  constructor(
    private auth: AngularFireAuth,
    private navigateService: NavigationService) { }


  signUp(email: string, password: string): Observable<authResult> {

    return from(this.auth.createUserWithEmailAndPassword(email, password))
      .pipe(
        map((res) => {
          // Handle successful sign-in
          this.authResult.result = true;
          this.authResult.message = res;
          return this.authResult;;
        }),
        catchError(error => {
          // Handle sign-in error
          this.authResult.result = false;
          this.authResult.message = error;
          return of(this.authResult);
        })
      );
  }


  signIn(email: string, password: string): Observable<authResult> {

    return from(this.auth.signInWithEmailAndPassword(email, password))
      .pipe(
        map((res) => {
          // Handle successful sign-in
          this.authResult.result = true;
          this.authResult.message = res;
          return this.authResult;
        }),
        catchError(error => {
          // Handle sign-in error
          this.authResult.result = false;
          this.authResult.message = error;
          return of(this.authResult);
        })
      );
  }

  signOut(): Observable<authResult> {
    // Check if user is signed in
    let currentUser: firebase.User;
    this.getCurrentUser().subscribe(user => {
      currentUser = user;
    });

    if (currentUser === null) {
      this.authResult.result = false;
      this.authResult.message = '';
      return of(this.authResult);
    }

    // Sign out the user
    return from(this.auth.signOut())
      .pipe(
        map((res) => {
          // Handle successful sign-out

          if (currentUser) {
            this.authResult.result = true;
            this.authResult.message = currentUser.email;
            return (this.authResult);
          } else {
            this.authResult.result = false;
            this.authResult.message = 'There is no one logged in!';
            return (this.authResult);
          }
        }),
        catchError(error => {
          // Handle sign-out error
          console.log(`sign out error as: ${error} typeof: ${typeof error}`);
          this.authResult.result = false;
          this.authResult.message = error;
          return of(this.authResult);
        })
      );
  }



  // signOut(): Observable<boolean> {
  //   return from(this.auth.signOut())
  //     .pipe(
  //       map((res) => {
  //         // Handle successful sign-in
  //         console.log(`res: ${res} typeof: ${typeof res}`);
  //         return true;
  //       }),
  //       catchError(error => {
  //         // Handle sign-in error
  //         console.log(`sign out error as: ${error} typeof: ${typeof error}`);
  //         return of(false);
  //       })
  //     );
  // }

  resetPassword(email: string): Observable<authResult> {
    return from(this.auth.sendPasswordResetEmail(email))
      .pipe(
        map((res) => {
          // Handle successful sign-in
          this.authResult.result = true;
          console.log('res here: ', res)
          this.authResult.message = 'pw reset success';
          return this.authResult;
        }),
        catchError(error => {
          // Handle sign-in error
          this.authResult.result = false;
          this.authResult.message = error;
          return of(this.authResult);
        })
      )
  }

  getCurrentUser(): Observable<firebase.User> {
    return this.auth.authState
  }

  getIdToken(): Observable<string> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return from(user.getIdToken());
        } else {
          return of(null);
        }
      })
    );
  }

}
