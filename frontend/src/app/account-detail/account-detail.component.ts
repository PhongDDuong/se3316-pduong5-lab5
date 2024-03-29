import { Component, OnInit, Input } from '@angular/core';
import { Account } from '../account';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CourseService } from '../course.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  @Input() account: Account;
  loggedInAccount: Account;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getAccount();
  }
  
  isAdmin(): boolean{
    if(this.loggedInAccount){
      if(this.loggedInAccount.admin=="true"){
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

  getAccount(): void {
    const account = this.route.snapshot.paramMap.get('account');
    this.courseService.getAccount(account)
      .subscribe(account => {
        this.account = account[0];
        this.loggedInAccount = JSON.parse(localStorage.getItem('user'));
        console.log(this.account)
      });
  }

  updatePassword(name: string,email: string,password: string, admin: string, activated: string): void {
    this.courseService.updateAccount(name,email,password,admin,activated)
    .subscribe();
    this.refresh();
  }

  activateAccount(name: string,email: string,password: string, admin: string, activated: string): void {
    var state = activated;

    if(state==="false"){
      state="true";
    }
    else if(state==="true"){
      state="false";
    }
    this.courseService.updateAccount(name,email,password,admin,state)
    .subscribe(result => console.log(result));
    this.refresh();
  }

  adminAccount(name: string,email: string,password: string, admin: string, activated: string): void {
    var state = admin;
    
    if(state==="false"){
      state="true";
    }
    else if(state==="true"){
      state="false";
    }
    this.courseService.updateAccount(name,email,password,state,activated)
    .subscribe(result => console.log(result));
    this.refresh();
  }

  goBack(): void {
    this.location.back();
  }

  refresh(): void {
    window.location.reload();
  }

}
