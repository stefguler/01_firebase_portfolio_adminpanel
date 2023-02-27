import { ProjectRequestsService } from './../services/project-requests.service';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../models/project';
import { NavigationService } from '../services/navigation.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-project',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {

  project: Project;
  projectId: string;
  RouteParamObs;
  preImageSrc: string | undefined;
  postImageSrc: string | undefined;

  constructor(
    private activeRoute: ActivatedRoute, 
    private navigationService: NavigationService, 
    private projectRequestService: ProjectRequestsService,
    private storage: AngularFireStorage
    
    ) {
  }

  ngOnInit() {
    this.RouteParamObs = this.activeRoute.paramMap.subscribe((param) => {  // use observable to retrieve the ID, because once the ngOnInit has instantiated the activeRoute, it will not do so again and you will have the same id all the time
      this.projectId = param.get('id')
      this.projectRequestService.getProject(this.projectId).subscribe((project: Project) => {
        this.project = project;
        const storageRef = this.storage.ref(`project-images/${this.project.imgPre}`)
        storageRef.getDownloadURL().subscribe((url) => {
          this.preImageSrc = url;
        });
        const storageRef2 = this.storage.ref(`project-images/${this.project.imgPost}`)
        storageRef2.getDownloadURL().subscribe((url) => {
          this.postImageSrc = url;
        });
      })
    });



  }

  navigateBack() {
    this.navigationService.navigateTo('')
  }


}
