import { Component, OnInit } from '@angular/core';
import { Schedule } from '../schedule';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  schedules: Schedule[] = [];
  account: Account;

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('user'));
    this.getSchedules();
  }

  addSchedule(name: string): void {
    if(this.account){
      this.courseService.addSchedule(name)
      .subscribe(schedule =>{
        if(schedule==undefined){
          alert("Schedule name already exists.")
        }
        else{
          this.refresh();
        }
      });
    }
    else{
      alert("You must sign in to create a schedule")
    }
  }

  getSchedules(): void {
    this.courseService.getSchedules()
      .subscribe(schedules => this.schedules = schedules);
  }

  refresh(): void {
    window.location.reload();
  }
}