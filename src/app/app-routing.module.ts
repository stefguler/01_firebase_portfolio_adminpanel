import { AuthGuardService } from './services/auth-guard.service';
import { LoginComponent } from './authentification/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { SignupComponent } from './authentification/signup/signup.component';
import { PwResetComponent } from './authentification/pw-reset/pw-reset.component';

const routes: Routes = [
  { path: '', component: PortfolioComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
  { path: 'portfolio/project/:id', component: ProjectsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'pw-reset', component: PwResetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
