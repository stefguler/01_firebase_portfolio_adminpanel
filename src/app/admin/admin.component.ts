import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Project } from '../models/project';
import { ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProjectRequestsService } from '../services/project-requests.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  title = 'Admin Panel';
  allProjects: Project[] = [];
  isFetching: boolean = false;
  @ViewChild('projectForm') form: NgForm;
  editMode: boolean = false;
  currentProjectId: string;
  errorMessage: string = null;
  errorSub: Subscription;

  constructor(private projectRequestService: ProjectRequestsService) { 
    }

    ngOnInit() {
      this.fetchProjects();
      this.errorSub = this.projectRequestService.error.subscribe((msg) => {
        this.errorMessage = msg;
      })

      console.log('all Projects', this.allProjects)
    }


      // POST using a http request service
  onProjectCreate(project: {
        id: number;
        date: Date;
        object: string;
        model: string;
        title: string;
        description: string;
        technique: string;
        colors: string[];
        price: string;
        imgPre: string;
        imgPost: string;
        altText: string; 
      }) {

    if (!this.editMode) {
      console.log(project)
      this.projectRequestService.createProject(project)
    }
    else {
      this.projectRequestService.updateProject(this.currentProjectId, project)
      this.editMode = false;
    }
  }

   // FETCH / GET using a http request service
   private fetchProjects() {
    this.isFetching = true;
    this.projectRequestService.fetchProjects().subscribe((response) => {
      this.allProjects = response;
      this.isFetching = false;
    }, (err) => {
      this.errorMessage = err.message
    })
  }

  onFetchProjects() {
    this.fetchProjects();
  }


  //DELETE using a http request service
  onDeleteProject(id: string) {
    this.projectRequestService.deleteProject(id);
  }

  onDeleteAllProjects() {
    this.projectRequestService.deleteAllProjects();

  }

  // UPDATE using a http request service

  onEditClicked(id: string) {
    this.currentProjectId = id;
    // get the product
    let currentProject = this.allProjects.find((project) => {
      return project.id.toString() === id
    })

    console.log(currentProject)

    //fill the form with product details
    this.form.setValue({
      title: currentProject.title,
      date: currentProject.date,
      object: currentProject.object,
      model: currentProject.model,
      description: currentProject.description,
      technique: currentProject.technique,
      colors: currentProject.colors,
      price: currentProject.price,
      imgPre: currentProject.imgPre,
      imgPost: currentProject.imgPost,
      altText: currentProject.altText
    });

    //change value from "Add Product" - button to "Update Product" Button
    this.editMode = true;

  }

}
