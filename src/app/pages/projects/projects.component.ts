import { ProjectRequestsService } from '../../services/project-requests.service';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-project',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {

  project: Project;
  projectId: string;
  RouteParamObs;

  constructor(
    private activeRoute: ActivatedRoute, 
    private navigationService: NavigationService, 
    private projectRequestService: ProjectRequestsService,    
    ) {
  }

  ngOnInit() {
    this.RouteParamObs = this.activeRoute.paramMap.subscribe((param) => {  // use observable to retrieve the ID, because once the ngOnInit has instantiated the activeRoute, it will not do so again and you will have the same id all the time
      this.projectId = param.get('id')
      this.projectRequestService.getProject(this.projectId).subscribe((project: Project) => {
        this.project = project;
        });
      })




  }

  navigateBack() {
    this.navigationService.navigateTo('')
  }


}
