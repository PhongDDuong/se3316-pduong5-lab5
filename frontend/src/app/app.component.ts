import { Component, OnInit } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { Account } from './account';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Schedule Maker';
  account: Account;

  checkLogin(): boolean{
    if(this.account!==null){
      return(true);
    }
    else{
      return(false);
    }
  }

  isAdmin(): boolean{
    if(this.checkLogin()){
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
    alert("Successfully logged out");
    this.refresh();
  }

  refresh(): void {
    window.location.reload();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('user'));
    console.log(this.account);
  }

}
