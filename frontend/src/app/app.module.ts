import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { HttpClientModule } from '@angular/common/http';
import { CourseSearchComponent } from './course-search/course-search.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';
import { AboutpageComponent } from './aboutpage/aboutpage.component';
import { LoginComponent } from './login/login.component';
import { CourseSearchBasicComponent } from './course-search-basic/course-search-basic.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { FooterComponent } from './footer/footer.component';
import { InfopageComponent } from './infopage/infopage.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    CourseDetailComponent,
    MessagesComponent,
    DashboardComponent,
    CourseSearchComponent,
    ScheduleDetailComponent,
    AboutpageComponent,
    LoginComponent,
    CourseSearchBasicComponent,
    AccountsComponent,
    AccountDetailComponent,
    FooterComponent,
    InfopageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
