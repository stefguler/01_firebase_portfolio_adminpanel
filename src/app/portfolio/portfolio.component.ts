import { ProjectRequestsService } from './../services/project-requests.service';
import { Component, OnInit } from '@angular/core';
import { Project } from '../models/project';
import { NavigationService } from '../services/navigation.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  title = 'Portfolio Panel';
  allProjects: Project[] = [];
  isFetching: boolean = false;
  editMode: boolean = false;
  errorMessage: string = null;
  errorSub: Subscription;
  postImageSrc: string | undefined;
  logout_result: boolean;
  message: string;


  constructor(
    private navigationService: NavigationService,
    private projectsRequestService: ProjectRequestsService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.fetchProjects();
    this.errorSub = this.projectsRequestService.error.subscribe((msg) => {
      this.errorMessage = msg;
    })
  }

  navigateToProject(id: string) {
    this.navigationService.navigateTo(`portfolio/project/${id}`)
  }

  navigate(adress: string) {
    this.navigationService.navigateTo(`${adress}`)
  }

  private fetchProjects() {
    this.isFetching = true;
    this.projectsRequestService.fetchProjects().subscribe((response) => {
      this.allProjects = response;
      this.allProjects.map((project) => {

      })

      this.isFetching = false;
    }, (err) => {
      this.errorMessage = err.message
    })
  }

  // logOut() {
  //   this.authService.signOut();
  // }



  logOut() {

    this.authService.signOut()
      .subscribe((authResult) => {

        if (authResult.result) {
          this.logout_result = true;
          this.message = `:) \n 
          ! Logout successfull !
          Good-Bye ${authResult.message}, hopefully see you soon again! \n `;

        } else {
          this.logout_result = false;
          let errorMessage: string;

          if (authResult.message.toString().includes("FirebaseError: Firebase: ")) {
            errorMessage = authResult.message.toString().replace("FirebaseError: Firebase: ", "")
          } else {
            errorMessage = authResult.message.toString();
          }
          this.message = ` :( \n
            ! Logout failed !
            ${errorMessage} \n 
            :( `;
        }

      });
  }


  closeInfoBox() {
    this.message = '';
    this.logout_result ? this.navigationService.navigateHome() : null;
  }


}

