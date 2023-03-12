import { ImageHandlerService } from './../services/image-handler.service';
import { NavigationService } from './../services/navigation.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ImageType, Project } from '../models/project';
import { ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ProjectRequestsService } from '../services/project-requests.service';
import { forkJoin, Observable, of, } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  title = 'Admin Panel';

  //project handling
  allProjects: Project[] = [];
  currentProject: Project;
  currentProjectId: string;

  //page handling
  isFetching: boolean = false;
  editMode: boolean = false;
  errorMessage: string = null;
  errorSub: Subscription;

  //form handling
  @ViewChild('projectForm') form: NgForm;

  preImgFile: File | null = null;
  postImgFile: File | null = null;
  imageFile: File | null = null;
  newPreImgName: string;
  newPostImgName: string;
  preImagePreview: string | undefined;
  postImagePreview: string | undefined;


  constructor(
    private projectRequestService: ProjectRequestsService,
    private navigationService: NavigationService,
    private imageHandler: ImageHandlerService,
  ) {

    this.currentProject = {
      id: '', date: null, object: '', model: '', title: '', description: '', technique: '',
      colors: [], price: '', imgPreName: '', imgPreSrc: '', imgPostName: '', imgPostSrc: '',
      altText: ''
    }
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
    imgPreName: string;
    imgPreSrc: string;
    imgPostName: string;
    imgPostSrc: string;
    altText: string;
  }) {

    const projectData = { ...projectFormValue };
    const projectImagePaths = {};
    const imageUploadPromises = [];

    // step 1: Enhance Project Data

    //enhance project with the alt Text
    projectData['altText'] = `${projectData.title}: Ein ${projectData.model} ${projectData.object} nach dem Einsatz von ${projectData.technique}`

    // hande pre image upload if there is any selected
    if (this.preImgFile) {

      //create the image upload task and prepare the urls to later store in the project data
      const newUploadTask = this.imageHandler.getUploadImageTask(ImageType.pre, this.newPreImgName, this.preImgFile!)
      projectImagePaths['imgPreName'] = `pre/${this.newPreImgName}`;
      imageUploadPromises.push(newUploadTask);

      // delete the current pre image if it exists
      if (this.currentProject.imgPreSrc) {
        this.imageHandler.deleteImage(ImageType.pre, this.currentProject.imgPreName)
      }
    } else {
      (this.currentProject.imgPreName) ? projectImagePaths['imgPreName'] = `pre/${this.currentProject.imgPreName}` : null;
    }

    // Upload post-image
    if (this.postImgFile) {

      //create the image upload task and prepare the urls to later store in the project data
      const newUploadTask = this.imageHandler.getUploadImageTask(ImageType.post, this.newPostImgName, this.postImgFile!)
      projectImagePaths['imgPostName'] = `post/${this.newPostImgName}`;
      imageUploadPromises.push(newUploadTask);

      // delete the current post image if it exists
      if (this.currentProject.imgPostSrc) {
        this.imageHandler.deleteImage(ImageType.post, this.currentProject.imgPostName)
      }
    } else {
      (this.currentProject.imgPostName) ? projectImagePaths['imgPostName'] = `post/${this.currentProject.imgPostName}` : null;
    }

    // Initialize the request variable
    let request: Observable<any>;

    // Wait for both image uploads to complete
    Promise.all(imageUploadPromises)
      .then(() => {
        // Add the image paths to the project data
        Object.assign(projectData, projectImagePaths);

        // create or update the project in the database
        let downloadPreImage$: Observable<string> = of(null);
        let downloadPostImage$: Observable<string> = of(null);

        //enhance the project data with the images url, if available
        if (projectData.imgPreName) {
          downloadPreImage$ = this.imageHandler.getImageUrl(ImageType.pre, projectData.imgPreName)
        }
        if (projectData.imgPostName) {
          downloadPostImage$ = this.imageHandler.getImageUrl(ImageType.post, projectData.imgPostName)
        }

        forkJoin([downloadPreImage$, downloadPostImage$]).subscribe((urls: string[]) => {
          projectData.imgPreSrc = urls[0];
          projectData.imgPostSrc = urls[1];
          projectData.imgPreName = this.newPreImgName;
          projectData.imgPostName = this.newPostImgName;

          (this.editMode) ? request = this.projectRequestService.updateProject(this.currentProjectId, projectData) :
            request = this.projectRequestService.createProject(projectData);

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
      })
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

  onDeleteProject(id: string) {
    this.projectRequestService.getProject(id).subscribe((selectedProject: Project) => {

      if (selectedProject.imgPreSrc) {
        this.imageHandler.deleteImage(ImageType.pre, selectedProject.imgPreName)
      }

      if (selectedProject.imgPostSrc) {
        this.imageHandler.deleteImage(ImageType.post, selectedProject.imgPostName)
      }

      this.projectRequestService.deleteProject(id).subscribe(() => {
        this.projectRequestService.fetchProjects().subscribe((projects: Project[]) => {
          this.allProjects = projects;
        });
      });
    });
  }

  onDeleteAllProjects() {
    this.projectRequestService.deleteAllProjects().subscribe(() => {
      this.projectRequestService.fetchProjects().subscribe((projects: Project[]) => {
        this.allProjects = projects;
      });
    });

    //clear the storage from the pictures
    this.deleteAllImages();
    this.onCancelEditMode();
    this.resetPageData();

  }

  // UPDATE using a http request service

  onEditClicked(id: string) {
    this.currentProjectId = id;
    // get the product
    this.currentProject = this.allProjects.find((project) => {
      return project.id === id
    })

    this.preImagePreview = this.currentProject.imgPreSrc
    this.postImagePreview = this.currentProject.imgPostSrc

    //fill the form with product details
    this.form.setValue({
      title: this.currentProject.title,
      date: this.currentProject.date,
      object: this.currentProject.object,
      model: this.currentProject.model,
      description: this.currentProject.description,
      technique: this.currentProject.technique,
      colors: this.currentProject.colors,
      price: this.currentProject.price,
      preimage: null,
      postimage: null,

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

  //always have to save the picture in a File before I can use it and on submit send it

  onImageChange(event: any) {

    this.imageFile = event.target.files[0];

    if (this.imageFile != undefined) {
      if (event.target.name === "preimage") {
        this.loadImage(ImageType.pre)
        this.newPreImgName = `${new Date().getTime()}_${this.imageFile?.name}`;
      } else if (event.target.name === "postimage") {
        this.loadImage(ImageType.post)
        this.newPostImgName = `${new Date().getTime()}_${this.imageFile?.name}`;
      } else {
        console.log('event.target.name not recognized: ', event.target.name)
      }
    } else {

      if (event.target.name === "preimage") {
        this.newPreImgName = undefined;
      } else if (event.target.name === "postimage") {
        this.postImagePreview = undefined;
      }
    }

  }

  deleteImage(imgEvent: any) {

    if (imgEvent.target.name === "preImageDelete") {

      this.imageHandler.deleteImage(ImageType.pre, `${this.currentProject.imgPreName}`)

      //reset the data
      this.preImgFile = null
      this.currentProject.imgPreName = '';
      this.currentProject.imgPreSrc = '';
      this.preImagePreview = ''
    }
    else if (imgEvent.target.name === "postImageDelete") {

      this.imageHandler.deleteImage(ImageType.post, `${this.currentProject.imgPostName}`)

      //reset the data
      this.postImgFile = null
      this.currentProject.imgPostName = '';
      this.currentProject.imgPostSrc = '';
      this.postImagePreview = ''
    }

  }


  deleteAllImages() {
    this.imageHandler.clearImages();
  }

  loadImage(imageType: ImageType) {

    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (imageType === ImageType.pre) {
        this.preImagePreview = event.target.result
        this.preImgFile = this.imageFile
      } else if (imageType === ImageType.post) {
        this.postImagePreview = event.target.result;
        this.postImgFile = this.imageFile
      }
    }
    reader.readAsDataURL(this.imageFile);
  }

  resetPageData() {
    this.form.reset();
    this.currentProject = {
      id: '', date: null, object: '', model: '', title: '', description: '', technique: '',
      colors: [], price: '', imgPreName: '', imgPreSrc: '', imgPostName: '', imgPostSrc: '',
      altText: ''
    };
    this.editMode = false;
    this.preImgFile = null;
    this.postImgFile = null;
    this.imageFile = null;
    this.preImagePreview = undefined;
    this.postImagePreview = undefined;
    this.newPreImgName = undefined;
    this.newPreImgName = undefined;
  }

  createNewUser() {
    this.navigationService.navigateTo('signup')
  }

}

