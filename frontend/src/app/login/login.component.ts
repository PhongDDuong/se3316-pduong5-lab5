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
      alert("missing input(s)")
    }
    else{
      this.courseService.loginAccount(email,password)
      .subscribe(account => {
        if(account==undefined){
          alert("account not found")
        }

        else if(account.activated==="false"){
          alert("Account has been deactivated. Please contact support@gmail.com to reactivate account.")
        }

        else{
          this.account = account;
          alert(this.account.name+" has signed in")
        }
      });
    }
  }

  ngOnInit(): void {
  }

}
