import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts: [] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this.courseService.getAccounts()
      .subscribe(accounts => this.accounts = accounts);
  }

}
