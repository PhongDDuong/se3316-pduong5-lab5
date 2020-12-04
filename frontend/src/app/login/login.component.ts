import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Account } from '../account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: Account;

  constructor(private courseService: CourseService) { }

  addAccount(name: string,email: string,password: string): void {
    if(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)||/[` !#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/.test(email)||/[` !@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(password)){
      alert("invalid characters used");
    }

    if(name===""|| email===""||password===""){
      alert("missing input(s)")
    }
    else{
      this.courseService.addAccount(name,email,password,"false","true")
      .subscribe();
    }
  }

  /*
  getAccount(email: string,password: string): void {
    if(/[`!#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/.test(email)||/[` !@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(password)){
      alert("invalid characters used");
    }

    if(name===""|| email===""||password===""){
      alert("missing input(s)")
    }
    else{
      this.courseService.getAccount(email,password)
      .subscribe();
    }
  }*/

  ngOnInit(): void {
  }

}
