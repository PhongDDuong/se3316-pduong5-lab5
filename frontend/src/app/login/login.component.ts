import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Account } from '../account';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: Account;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) { }

  addAccount(name: string,email: string,password: string): void {
    if(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)||/[` !#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/.test(email)||/[` !@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(password)){
      alert("invalid characters used");
    }

    if(name===""|| email===""||password===""){
      alert("missing input(s)")
    }
    else{
      this.courseService.addAccount(name,email,password,"false","true")
      .subscribe(account => {
        if(account==undefined){
          alert("An account with that email already exists")
        }
      });
    }
  }
  
  loginAccount(email: string,password: string): void {
    if(/[`!#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/.test(email)||/[` !@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(password)){
      alert("invalid characters used");
    }
    if(email=="admin"){
      email="support@gmail.com";
    }

    if(email===""||password===""){
      alert("Please enter required fields")
    }
    else if(email===""){
      alert("Please enter a valid email")
    }
    else if(password===""){
      alert("Please enter a password")
    }
    else{
      this.courseService.loginAccount(email,password)
      .subscribe(account => {
        if(account==undefined){
          alert("Wrong email or password")
        }

        else if(account.activated==="false"){
          alert("Account has been deactivated. Please contact support@gmail.com to reactivate account.")
        }

        else{
          this.account = account;
          //alert(this.account.name+" has signed in");
          localStorage.setItem('user',JSON.stringify(account))
          this.router.navigateByUrl('/'); 
          this.router.navigate(['/listview']);
          
          //this.goBack();
        }
      });
    }
  }


  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    console.log(this.account)
  }

}
