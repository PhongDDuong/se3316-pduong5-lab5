import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course';
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
  reviews: Object[];
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
            var newReview = {
              review: review[0].review[i],
              lastModString: review[0].times[i],
              creator: review[0].names[i],
              hidden: review[0].hidden[i],
            }
            if (this.account) {
              if(this.account.admin=="true"||newReview.hidden==false){
                this.reviews.push(newReview);
              }
            }
            else{
              if(newReview.hidden==false){
                this.reviews.push(newReview);
              }
            }
          }
        }
      });
  }

  hideReview(creator: string,review:string,lastModString:string): void{
    if(this.account){
      console.log(creator,review,lastModString)
      
      this.courseService.hideReview(this.course.subject,this.course.catalog_nbr.toString(),review,creator,lastModString)
      .subscribe(review => {
        console.log(review);
        this.refresh();
      });
    }
    else{
      alert("Must be signed in to make review")
    }
  }

  isAdmin(): boolean{
    if(this.account){
      if(this.account.admin=="true"){
        return(true);
      }
      else{
        return(false);
      }
    }
    else{
      return(false);
    }
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