import { Component, OnInit, Input } from '@angular/core';
import { Schedule } from '../schedule';
import { Course } from '../course';
import { Account } from '../account';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CourseService } from '../course.service';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit {
  @Input() schedule: Schedule;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) {}

  courses: Course[];
  matchingCourses = [];
  account: Account;
  date: Date;



  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('user'));
    this.getSchedule();
  }

  checkOwner(): boolean{
    if(this.account){
      if(this.account.name == this.schedule.creator|| this.account.admin == "true"){
        return(true);
      }
      else{
        return(false);
      }
    }
  }

  togglePublic(): void{
    if(this.checkOwner()){
      var state = this.schedule.public;
      if(state=="false"){
        state = "true";
      }
      else{
        state = "false";
      }
      console.log(state)
      this.courseService.updateSchedulePub(this.schedule.schedule,this.account.name,state)
      .subscribe();
      this.refresh();
    }
    else{
      alert("You do not have permission to change this schedule")
    }
  }

  
  updateDesc(input: string): void{
    if(this.checkOwner()){
      console.log(input);
      this.courseService.updateScheduleDesc(this.schedule.schedule,this.account.name,input)
      .subscribe();
      this.refresh();
    }
    else{
      alert("You do not have permission to change this schedule")
    }
  }

  refresh(): void {
    window.location.reload();
  }

  showButtons(): void{
    document.getElementById("cancel").hidden = false;
    document.getElementById("confirm").hidden = false;
  }

  deleteSchedule(answer: string): void {
    if(answer=='false'){
      document.getElementById("cancel").hidden = true;
      document.getElementById("confirm").hidden = true;
    }
    else{
      const name = this.route.snapshot.paramMap.get('name');
      this.courseService.deleteSchedule(name)
      .subscribe(schedule => {
        this.goBack();
      });
    }
    
  }

  removeCourse(subject: string,catalog_nbr: string): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.courseService.updateSchedule(name,this.account.name,subject,catalog_nbr)
      .subscribe();
    this.refresh();
  }

  getSchedule(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.courseService.getSchedule(name)
      .subscribe(schedule => {
        this.schedule = schedule[0];
        this.getCourses();
        console.log(this.schedule);
      });
  }

  getCourses(): void {
    this.courseService.getCourses()
        .subscribe(courses => {
          this.courses = courses;
          this.getScheduleCourses();
        })
  }

  getScheduleCourses(): void{//////////////////////////////////////////////change this
    //console.log(this.courses[0].catalog_nbr);
    var catnum = this.schedule.catalog_nbr.split(",");
    var subjects = this.schedule.subject.split(",");
    for (let i = 0; i < catnum.length; i++) {
      for(var course of this.courses){
        if(course.catalog_nbr.toString()==catnum[i] && course.subject==subjects[i]){
          this.matchingCourses.push(course);
        }
      }
    }
  }
  
  goBack(): void {
    this.location.back();
  }
}
