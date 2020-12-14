import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-search-basic',
  templateUrl: './course-search-basic.component.html',
  styleUrls: ['./course-search-basic.component.css']
})
export class CourseSearchBasicComponent implements OnInit {

  courses$: Observable<Course[]>;
  postData ={};

  private searchTerms = new Subject<string>();

  constructor(private courseService: CourseService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.courses$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.courseService.searchCourses(term)),
    );
  }
}
