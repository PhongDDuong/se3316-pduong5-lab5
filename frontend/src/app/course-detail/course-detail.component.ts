import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course';
import { Review } from '../review';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  @Input() course: Course;
  reviews: Review[];
  account: Account;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getCourse();
    this.account = JSON.parse(localStorage.getItem('user'))
  }

  postReview(review: string): void{
    console.log(review);
  }

  getReviews(): void {
    this.courseService.getReview(this.course.subject,this.course.catalog_description)
      .subscribe(review => {
        console.log(review);
      });
  }

  getCourse(): void {
    const catalog_nbr = this.route.snapshot.paramMap.get('catalog_nbr');
    const subject = this.route.snapshot.paramMap.get('subject');
    this.courseService.getCourse(subject,catalog_nbr)
      .subscribe(course => {
        console.log(course);
        this.course = course;
      });
  }
  
  goBack(): void {
    this.location.back();
  }
}