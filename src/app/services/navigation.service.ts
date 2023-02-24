import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  navigateHome() {

      this.router.navigate([''])

  }

  navigateTo(adress: string) {
    this.router.navigate([adress])
  }

}
