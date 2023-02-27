import { NavigationService } from './../services/navigation.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Project } from '../models/project';
import { ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProjectRequestsService } from '../services/project-requests.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import 'firebase/compat/storage';
import { forkJoin, Observable, } from 'rxjs';

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

  preImgFile: File | null = null;
  postImgFile: File | null = null;
  preImgUrl: string | null = null;
  postImgUrl: string | null = null;
  preImageSrc: string | undefined;
  postImageSrc: string | undefined;


  constructor(private projectRequestService: ProjectRequestsService,
    private navigationService: NavigationService,
    private storage: AngularFireStorage) {
  }

  ngOnInit() {
    this.fetchProjects();
    this.errorSub = this.projectRequestService.error.subscribe((msg) => {
      this.errorMessage = msg;
    })

  }

  onProjectCreateOrUpdate(projectFormValue: {
    id: string;
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

    // Update an existing project
    const projectData = { ...projectFormValue };
    const projectImagePaths = {};
    const storageRef = this.storage.ref('project-images');

    // Upload pre-image
    const preImageName = this.preImgUrl //`${new Date().getTime()}_${this.preImgFile?.name}`;
    const preImagePath = `pre/${preImageName}`;
    const preImageRef = storageRef.child(preImagePath);
    const preImageTask = preImageRef.put(this.preImgFile!);
    projectImagePaths['imgPre'] = preImagePath;

    // Upload post-image
    const postImageName = this.postImgUrl //`${new Date().getTime()}_${this.postImgFile?.name}`;
    const postImagePath = `post/${postImageName}`;
    const postImageRef = storageRef.child(postImagePath);
    const postImageTask = postImageRef.put(this.postImgFile!);
    projectImagePaths['imgPost'] = postImagePath;

    // create alt Text
    const altText = `
      ${projectData.title}: 
      Ein ${projectData.model} 
      ${projectData.object} nach dem 
      Einsatz von ${projectData.technique}`

    projectData['altText'] = altText;

    // Initialize the request variable
    let request: Observable<any>;

    // Wait for both image uploads to complete
    Promise.all([preImageTask, postImageTask])
      .then(() => {
        // Add the image paths to the project data
        Object.assign(projectData, projectImagePaths);

        // create or update the project in the database
        const downloadPreImage$ = this.storage.ref(`project-images/${projectData.imgPre}`).getDownloadURL();
        const downloadPostImage$ = this.storage.ref(`project-images/${projectData.imgPost}`).getDownloadURL();

        forkJoin([downloadPreImage$, downloadPostImage$]).subscribe((urls: string[]) => {
          projectData.imgPre = urls[0];
          projectData.imgPost = urls[1];

          (this.editMode) ? request = this.projectRequestService.updateProject(this.currentProjectId, projectData) :
            request = this.projectRequestService.createProject(projectData);
          // console.log('request', request);

          // Subscribe to the request to update the allProjects array
          request.subscribe((response: any) => {
            if (this.editMode) {
              // Find the project in the allProjects array and update it
              const index = this.allProjects.findIndex(project => project.id === this.currentProjectId);
              this.allProjects[index] = response;
            } else {
              // Add the new project to the beginning of the allProjects array
              this.allProjects.unshift(response);
            }
            // Reset the form
            this.resetPageData();
          });
        });
      }
      );
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
  // onDeleteProject(id: string) {
  //   this.projectRequestService.deleteProject(id);
  // }

  onDeleteProject(id: string) {
    this.projectRequestService.deleteProject(id).subscribe(() => {
      this.projectRequestService.fetchProjects().subscribe((projects: Project[]) => {
        this.allProjects = projects;
      });
    });
  }

  onDeleteAllProjects() {
    this.projectRequestService.deleteAllProjects().subscribe(() => {
      this.projectRequestService.fetchProjects().subscribe((projects: Project[]) => {
        this.allProjects = projects;
      });
    });
  }

  //old way
  // onDeleteAllProjects() {
  //   this.projectRequestService.deleteAllProjects();
  // }

  // UPDATE using a http request service

  onEditClicked(id: string) {
    this.currentProjectId = id;
    // get the product
    let currentProject = this.allProjects.find((project) => {
      return project.id === id
    })

    this.preImageSrc = currentProject.imgPre
    this.postImageSrc = currentProject.imgPost

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
    });

    //change value from "Add Product" - button to "Update Product" Button
    this.editMode = true;

  }

  onCancelEditMode() {
    this.editMode = false;
    this.resetPageData()

  }

  navigate(adress: string) {
    this.navigationService.navigateTo(adress)
  }

  //old way without picture upload
  //   uploadImage(event: any, type: string) {
  //     const file = event.target.files[0];
  //     const fileName = `${new Date().getTime()}_${file.name}`;
  //     const fileRef = this.storage.ref(fileName);
  //     const task = this.storage.upload(fileName, file);

  //     task.snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe(url => {
  //           if (type === 'pre') {
  //             this.preImgUrl = url;
  //           } else {
  //             this.postImgUrl = url;
  //           }
  //         });
  //       })
  //     ).subscribe();
  //   }


  //always have to save the picture in a File before I can use it and on submit send it
  onPreImageChange(event: any) {
    this.preImgFile = event.target.files[0];
    console.log(this.preImgFile)

    if (this.preImgFile != undefined) {
      this.loadPreImage();
      this.preImgUrl = `${new Date().getTime()}_${this.preImgFile?.name}`
      console.log('this.postImgUrl', this.preImgUrl)
      this.form.controls['imgPre'].setValue(this.preImgUrl)
    } else {
      this.preImgUrl = undefined
      this.preImageSrc = undefined
      this.form.controls['imgPre'].setValue('')
    }
  }

  //always have to save the picture in a File before I can use it and on submit send it
  onPostImageChange(event: any) {
    this.postImgFile = event.target.files[0];

    if (this.postImgFile != undefined) {
      this.loadPostImage();
      this.postImgUrl = `${new Date().getTime()}_${this.postImgFile?.name}`
      console.log('this.postImgUrl', this.postImgUrl)
      this.form.controls['imgPost'].setValue(this.postImgUrl)
    } else {
      this.postImgUrl = undefined
      this.postImageSrc = undefined
      this.form.controls['imgPost'].setValue('')
    }
  }

  loadPreImage() {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.preImageSrc = event.target.result;
    };
    reader.readAsDataURL(this.preImgFile);
  }

  loadPostImage() {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.postImageSrc = event.target.result;
    };
    reader.readAsDataURL(this.postImgFile);
  }

  resetPageData() {
    this.form.reset();
    this.editMode = false;
    this.preImageSrc = "";
    this.postImageSrc = "";
    this.preImgFile = null;
    this.postImgFile = null;
    this.preImgUrl = null;
    this.postImgUrl = null;
  }

}

