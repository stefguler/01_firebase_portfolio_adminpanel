import { ProjectRequestsService } from './../services/project-requests.service';
import { Component, OnInit } from '@angular/core';
import { Project } from '../models/project';
import { NavigationService } from '../services/navigation.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {

  projects: Project[] = [];
  
  constructor(private navigationService: NavigationService, private projectsRequestService: ProjectRequestsService) {
  }

  ngOnInit(): void {
    // this.projects = this.projectsRequestService.projects;
  }

  navigateToProject(id: string) {
    this.navigationService.navigateTo(`portfolio/project/${id}`)
  }

  navigate(adress: string) {
    console.log(adress)
    this.navigationService.navigateTo(`${adress}`)
  }

}
