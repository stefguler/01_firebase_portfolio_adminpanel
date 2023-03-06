import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, of, Subject, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Project } from '../models/project';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class ProjectRequestsService {

  error = new Subject<string>();
  url: string = 'https://fir-74b92-default-rtdb.firebaseio.com/projects';

  constructor(
    private http: HttpClient,
    private auth: AuthService) { }



    createProject(project: Project): Observable<Project> {
      return this.auth.getIdToken().pipe(
        switchMap(token => {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          });
          console.log('Token:', token); // log the token here
          console.log('Project: ', project)
  
          return this.http.post<{name: string}>(`${this.url}.json`, project, { headers }).pipe(
            switchMap(res => {
              const newProject: Project = {...project, id: res.name};
              return of(newProject);
            })
          );
        })
      );
    }


    
  // createProject(project: {
  //   id: string;
  //   date: Date;
  //   object: string;
  //   model: string;
  //   title: string;
  //   description: string;
  //   technique: string;
  //   colors: string[];
  //   price: string;
  //   imgPreName: string;
  //   imgPreSrc: string;
  //   imgPostName: string;
  //   imgPostSrc: string;
  //   altText: string;
  // }): Observable<Project> {

    
  //   return this.http.post<{name: string}>(`${this.url}.json`, project).pipe(
  //     switchMap(res => {
  //       const newProject: Project = {...project, id: res.name};
  //       return of(newProject);
  //     })
  //   );
  // }


  // adding headers Authorization
  // createProject(project: {
  //   id: string;
  //   date: Date;
  //   object: string;
  //   model: string;
  //   title: string;
  //   description: string;
  //   technique: string;
  //   colors: string[];
  //   price: string;
  //   imgPreName: string;
  //   imgPreSrc: string;
  //   imgPostName: string;
  //   imgPostSrc: string;
  //   altText: string;
  // }): Observable<Project> {
  //   return this.authService.getAuthToken().pipe(
  //     switchMap((authToken: string) => {
  //       const httpOptions = {
  //         headers: new HttpHeaders({
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${authToken}`
  //         })
  //       };
  //       return this.http.post<{name: string}>(`${this.url}.json`, project, httpOptions).pipe(
  //         map(res => {
  //           const newProject: Project = {...project, id: res.name};
  //           return newProject;
  //         })
  //       );
  //     })
  //   );
  // }

  //fetch product in database
  fetchProjects() {
    return this.http.get<{ [key: string]: Project }>(`${this.url}.json`)
      //transform the data to usefull format
      .pipe(map((res) => {
        const projectsArray = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            projectsArray.push({ ...res[key], id: key })
          }

        }
        return projectsArray
        //catch the error and log it somewhere
      }), catchError((errorRes) => {

        //implement here what you wan't to do with your error!

        //always make sure to return the error here
        return throwError(errorRes);
      }))
  }

  //get a specific project
  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.url}/${id}.json`);
  }

  //delete a specific project from database
  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}.json`);
  }

  // delete all projects from DB
  deleteAllProjects(): Observable<any> {
    return this.http.delete<any>(`${this.url}.json`);
  }
  
  //old way
  // deleteAllProjects() {
  //   this.http.delete<any>(`${this.url}.json`)
  //     .subscribe();
  // }

  updateProject(id: string, project: Project): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}.json`, project);
  }

  //old way
  // updateProject(id: string, project: Project): Observable<any> {
  //   return this.http.put<any>(`${this.url}/${id}.json`, project)
  //     .pipe(
  //       map(res => {
  //         return { project: res.data }
  //       })
  //     );
  // updateProject(id: string, value: Project) {
  //   this.http.put<any>(`${this.url}/${id}.json`, value)
  //   .subscribe();
  // }

  }