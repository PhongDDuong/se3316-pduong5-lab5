import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course';
import { Review } from '../review';
import { Account } from '../account';

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
  reviews: string[];
  account: Account;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.reviews = [];
    this.getCourse();
    this.account = JSON.parse(localStorage.getItem('user'))
  }

  postReview(review: string): void{
    if(this.account){
      this.courseService.addReview(this.course.subject,this.course.catalog_nbr.toString(),review,this.account.name)
      .subscribe(review => {
        console.log(review);
        this.refresh();
      });
    }
    else{
      alert("Must be signed in to make review")
    }
  }

  getReviews(): void {
    this.courseService.getReview(this.course.subject,this.course.catalog_nbr.toString())
      .subscribe(review => {
        console.log(review[0])
        if(review[0]){
          for(var i =0; i<review[0].review.length;i++){
            console.log(review[0].review[i])
            this.reviews.push(review[0].names[i]+": "+review[0].review[i]+" Posted: "+review[0].times[i]);
          }
        }
      });
  }

  getCourse(): void {
    const catalog_nbr = this.route.snapshot.paramMap.get('catalog_nbr');
    const subject = this.route.snapshot.paramMap.get('subject');
    this.courseService.getCourse(subject,catalog_nbr)
      .subscribe(course => {
        console.log(course);
        this.course = course;
        this.getReviews();
      });
  }

  refresh(): void {
    window.location.reload();
  }

  goBack(): void {
    this.location.back();
  }
}