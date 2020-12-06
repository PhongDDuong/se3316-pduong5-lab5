import { Component, OnInit } from '@angular/core';
import { Account } from './account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Schedule Maker';
  account: Account;

  constructor(private router: Router) { }

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

  logout(): void{
    localStorage.clear();
    //alert("Successfully logged out");
    this.refresh();
    this.router.navigateByUrl('/'); 
  }

  refresh(): void {
    window.location.reload();
  }
  /*
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }*/

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('user'));
  }

}
