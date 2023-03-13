import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of, Subject, switchMap, catchError, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectRequestsService {

  error = new Subject<string>();
  url: string = 'https://fir-74b92-default-rtdb.firebaseio.com/projects';

  constructor(
    private http: HttpClient,
    private auth: AuthService) { }

  //fetch product in database
  fetchProjects() {
    return this.auth.getIdToken().pipe(
      switchMap(token => {

        /*Authorization via Request Headers, doesn't seem to work with firebase unfortunately
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Firebase ${token}` // according to firebase authentification its 'Firebase + token' instead of 'Bearer + token'
        }); */

        return this.http.get<{ [key: string]: Project }>(`${this.url}.json?auth=${token}`)
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
      }))
  }

    //get a specific project
    getProject(id: string): Observable<Project> {
      return this.auth.getIdToken().pipe(
        switchMap(token => {
          /*Authorization via Request Headers, doesn't seem to work with firebase unfortunately
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Firebase ${token}` // according to firebase authentification its 'Firebase + token' instead of 'Bearer + token'
          });*/

          return this.http.get<Project>(`${this.url}/${id}.json?auth=${token}`);
        }))
    }

  createProject(project: Project): Observable<Project> {
    return this.auth.getIdToken().pipe(
      switchMap(token => {

        /* Authorization via Request Headers, doesn't seem to work with firebase unfortunately
          const headers = new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': `Firebase ${token}` // according to firebase authentification its 'Firebase + token' instead of 'Bearer + token'
         });
         return this.http.post<{name: string}>(`${this.url}.json`, project, { headers }).pipe( */

        return this.http.post<{ name: string }>(`${this.url}.json?auth=${token}`, project).pipe(
          switchMap(res => {
            const newProject: Project = { ...project, id: res.name };
            return of(newProject);
          })
        );
      })
    );
  }

  //update specific project
  updateProject(id: string, project: Project): Observable<any> {
    return this.auth.getIdToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Firebase ${token}` // according to firebase authentification its 'Firebase + token' instead of 'Bearer + token'
        });
        return this.http.put<any>(`${this.url}/${id}.json?auth=${token}`, project);
      }))
  }

  // delete all projects
  deleteAllProjects(): Observable<any> {
    return this.auth.getIdToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Firebase ${token}` // according to firebase authentification its 'Firebase + token' instead of 'Bearer + token'
        });
        return this.http.delete<any>(`${this.url}.json?auth=${token}`);
      }))
  }

    //delete a specific project
    deleteProject(id: string): Observable<any> {
      return this.auth.getIdToken().pipe(
        switchMap(token => {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Firebase ${token}` // according to firebase authentification its 'Firebase + token' instead of 'Bearer + token'
          });
          return this.http.delete<any>(`${this.url}/${id}.json?auth=${token}`);
        }))
    }


}