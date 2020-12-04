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

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.getSchedules();
  }

  addSchedule(name: string): void {
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

  getSchedules(): void {
    this.courseService.getSchedules()
      .subscribe(schedules => this.schedules = schedules);
  }

  refresh(): void {
    window.location.reload();
  }
}