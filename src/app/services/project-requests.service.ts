import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectRequestsService {

  error = new Subject<string>();
  url:string = 'https://fir-74b92-default-rtdb.firebaseio.com/projects';

  constructor(private http: HttpClient) { }

  createProject(project: {   
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

    console.log('posting', project);
   
    this.http.post(`${this.url}.json`, project)
      .subscribe((res) => {
        console.log(res)
      }, (err) => {
        this.error.next(err.message)
      })
  }

  //fetch product in database
  fetchProjects() {
    return this.http.get<{ [key: string]: Project }>(`${this.url}.json`) 
      //transform the data to usefull format
      .pipe(map((res) => {
        const projects = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            projects.push({ ...res[key], id: key })
          }
          
        }
        return projects
        //catch the error and log it somewhere
      }), catchError((err) => {

        //implement here what you wan't to do with your error!

        //always make sure to return the error here
        return throwError(err);
      }))
  }

  //delete a product from database
  deleteProject(id: string) {
      this.http.delete<any>(`${this.url}/${id}.json`)
      .subscribe();
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.url}/${id}.json`);
  }

  deleteAllProjects() {
    this.http.delete<any>(`${this.url}.json`)
      .subscribe();
  }

  //delete a product from database
  updateProject(id: string, value: Project) {
    this.http.put<any>(`${this.url}/${id}.json`, value)
    .subscribe();
  }

}
