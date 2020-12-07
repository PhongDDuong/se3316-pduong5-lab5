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
  accountSchedules: Schedule[] = [];
  publicSchedules: Schedule[] = [];
  account: Account;

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('user'));
    this.getSchedules();
  }

  addSchedule(name: string): void {
    if(this.account){
      this.courseService.addSchedule(name,this.account.name,"false"," ")
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
      .subscribe(schedules => {
        this.schedules = schedules;
        this.filterSchedules();
      });

  }

  filterSchedules(): void {
    
    if(this.account){
      for(var i = 0; i<this.schedules.length;i++){
        if(this.schedules[i].creator==this.account.name){
          this.accountSchedules.push(this.schedules[i])
        }
      }
    }

    var count2 = 0;
    for(var i = 0; i<this.schedules.length;i++){
      if(this.schedules[i].public=="true"){
        this.publicSchedules.push(this.schedules[i])
        count2++;
        if(count2>=10){
          break;
        }
       }
    }

    console.log(this.accountSchedules)
  }

  refresh(): void {
    window.location.reload();
  }
}