import { Component, OnInit } from '@angular/core';
import { Account } from '../account';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CourseService } from '../course.service';

@Component({
  selector: 'app-infopage',
  templateUrl: './infopage.component.html',
  styleUrls: ['./infopage.component.css']
})
export class InfopageComponent implements OnInit {
  account:Account;
  text:String;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('user'));
    this.getText();
  }
  isAdmin(): boolean{
    if(this.account){
      if(this.account.admin == "true"){
        return(true);
      }
      else{
        return(false);
      }
    }
  }
  getText(): void{
    fetch('../DMCA-Policy.txt')
      .then(response => response.text())
      .then(text => console.log(text))
  }

  /*
  updateText(): void{
    const page = this.route.snapshot.paramMap.get('page');
    this.courseService.getSchedule(page)
      .subscribe(page => {

        console.log(page);
      });
  }*/



}
