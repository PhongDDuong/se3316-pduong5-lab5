import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';
import { AboutpageComponent } from './aboutpage/aboutpage.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'courses', component: CoursesComponent },
  { path: 'schedules', component: DashboardComponent },
  { path: 'about', component: AboutpageComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/schedules', pathMatch: 'full' },
  { path: 'detail/:subject/:catalog_nbr', component: CourseDetailComponent },
  { path: 'schedule/:name', component: ScheduleDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }