import { AuthService } from './services/auth.service';
import { NavigationService } from './services/navigation.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment.prod';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PortfolioComponent } from './portfolio/portfolio.component';
import { ProjectRequestsService } from './services/project-requests.service';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';

//auth
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';

//icons

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    ProjectsComponent,
    AdminComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent, NavigationService, ProjectRequestsService, AuthService]
})
export class AppModule { }
