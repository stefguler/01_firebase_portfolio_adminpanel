import { ProjectRequestsService } from './../services/project-requests.service';
import { Component, OnInit } from '@angular/core';
import { Project } from '../models/project';
import { NavigationService } from '../services/navigation.service';
import { Subscription } from 'rxjs/internal/Subscription';


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

  
  constructor(private navigationService: NavigationService, private projectsRequestService: ProjectRequestsService) {
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
    console.log(adress)
    this.navigationService.navigateTo(`${adress}`)
  }

  private fetchProjects() {
    this.isFetching = true;
    this.projectsRequestService.fetchProjects().subscribe((response) => {
      this.allProjects = response;
      this.isFetching = false;
    }, (err) => {
      this.errorMessage = err.message
    })
  }

}
