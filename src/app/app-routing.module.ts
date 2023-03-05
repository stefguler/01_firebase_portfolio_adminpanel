import { AuthGuardService } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  { path: '', component: PortfolioComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
  { path: 'portfolio/project/:id', component: ProjectsComponent},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
