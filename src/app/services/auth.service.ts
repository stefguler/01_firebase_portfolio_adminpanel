import { NavigationService } from './navigation.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, of, switchMap, Observable, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private navigateService: NavigationService) { }

  
    signUp(email: string, password: string): Observable<boolean> {
      return from(this.auth.createUserWithEmailAndPassword(email, password))
        .pipe(
          map((res) => {
            // Handle successful sign-in
            console.log(`res: ${res} typeof: ${typeof res}`);
            return true;
          }),
          catchError(error => {
            // Handle sign-in error
            console.log(`sign in error as: ${error} typeof: ${typeof error}`);
            return of(false);
          })
        );
    }


  signIn(email: string, password: string): Observable<boolean> {
    return from(this.auth.signInWithEmailAndPassword(email, password))
      .pipe(
        map((res) => {
          // Handle successful sign-in
          console.log(`res: ${res} typeof: ${typeof res}`);
          return true;
        }),
        catchError(error => {
          // Handle sign-in error
          console.log(`sign in error as: ${error} typeof: ${typeof error}`);
          return of(false);
        })
      );
  }

  signOut(): Observable<boolean> {
    return from(this.auth.signOut())
      .pipe(
        map((res) => {
          // Handle successful sign-in
          console.log(`res: ${res} typeof: ${typeof res}`);
          return true;
        }),
        catchError(error => {
          // Handle sign-in error
          console.log(`sign in error as: ${error} typeof: ${typeof error}`);
          return of(false);
        })
      );
  }

  resetPassword(email: string): Observable<boolean> {
    return from(this.auth.sendPasswordResetEmail(email))
      .pipe(
        map((res) => {
          // Handle successful sign-in
          console.log(`res: ${res} typeof: ${typeof res}`);
          return true;
        }),
        catchError(error => {
          // Handle sign-in error
          console.log(`sign in error as: ${error} typeof: ${typeof error}`);
          return of(false);
        })
      );
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
