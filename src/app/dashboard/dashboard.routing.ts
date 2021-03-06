import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { GuardService } from './services/guard.service';
import { DefaultGuardService } from './services/default-guard.service';
import { Breadcrumbs } from './../dashboard/classes/breadcrumb.class';


const routes: Routes = [
  {
    path: 'home', component: HomeComponent, canActivate: [GuardService],
    data: { breadcrumbs: new Breadcrumbs([]) }
  },
  { path: 'login', component: LoginComponent, canActivate: [DefaultGuardService] },
  { path: '**', component: ErrorComponent, canActivate: [DefaultGuardService] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule { }
