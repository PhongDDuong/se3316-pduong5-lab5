import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
//import { ScheduleDetailComponent } from '../schedule-detail/schedule-detail.component';


import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: [ './course-search.component.css' ]
})
export class CourseSearchComponent implements OnInit {
  courses$: Observable<Course[]>;
  account: Account;

  private searchTerms = new Subject<string>();

  constructor(private courseService: CourseService, private route: ActivatedRoute) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  updateSchedule(subject: string,catalog_nbr: string): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.courseService.updateSchedule(name,this.account.name,subject,catalog_nbr)
      .subscribe();
    this.refresh();
  }

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('user'));
    this.courses$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.courseService.searchCourses(term)),
    );
  }

  refresh(): void {
    window.location.reload();
  }
}