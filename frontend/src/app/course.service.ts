import { Injectable } from '@angular/core';
import { Course } from './course';
import { Schedule } from './schedule';
import { Account } from './account';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesUrl = 'http://localhost:3000/api/courses';
  private scheduleUrl = 'http://localhost:3000/api/schedule';
  private accountUrl = 'http://localhost:3000/api/account';


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /*
  getCourses(): Observable<Course[]> {
    console.log(COURSES);
    return of(COURSES);
  }*/
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getSchedules(): Observable<[]> {
    this.messageService.add('CourseService: fetched schedules');
    return this.http.get<[]>(this.scheduleUrl)
    .pipe(
      tap(_ => this.log('fetched courses')),
      catchError(this.handleError<[]>('getCourses', []))
    );
  }

  getSchedule(name: string): Observable<Schedule> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)){
      alert("invalid characters used");
    }
    else{
      const url = `${this.scheduleUrl}/${name}`;
      return this.http.get<Schedule>(url).pipe(
        tap(_ => this.log(`fetched schedule=${name}`)),
        catchError(this.handleError<Schedule>(`getSchedule id=${name}`))
      );
    }
  }

  addSchedule(name: string): Observable<Schedule> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        schedule: name,
        subject: " ",
        catalog_nbr: " ",
      }
      const url = `${this.scheduleUrl}/create/`;
      return this.http.post<Schedule>(url, postData).pipe(
        tap(_ => this.log(`added schedule id=${name}`)),
        catchError(this.handleError<Schedule>('deleteSchedule'))
      );
    }
  }

  deleteSchedule(name: String): Observable<Schedule> {
    const url = `${this.scheduleUrl}/${name}`;
    return this.http.delete<Schedule>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted schedule id=${name}`)),
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  addAccount(name: String,email: String,password: String,admin: String,activated: String): Observable<Schedule> {
    var postData = {
      name: name,
      email: email,
      password: password,
      admin: admin,
      activated: activated,
    }

    const url = `${this.accountUrl}/create/`;
    return this.http.post<Schedule>(url, postData).pipe(
      tap(_ => this.log(`added schedule id=${name}`)),
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  updateAccount(name: String,email: String,password: String,admin: String,activated: String): Observable<Schedule> {
    var postData = {
      name: name,
      email: email,
      password: password,
      admin: admin,
      activated: activated,
    }

    const url = `${this.accountUrl}`;
    return this.http.post<Schedule>(url, postData).pipe(
      tap(_ => this.log(`added schedule id=${name}`)),
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  getAccounts(): Observable<[]> {
    this.messageService.add('CourseService: fetched accounts');
    return this.http.get<[]>(this.accountUrl)
    .pipe(
      tap(_ => this.log('fetched accounts')),
      catchError(this.handleError<[]>('getAccounts', []))
    );
  }

  getAccount(account: string): Observable<Account> {
    const url = `${this.accountUrl}/${account}`;
    return this.http.get<Account>(url).pipe(
      tap(_ => this.log(`fetched course=${account}`)),
      catchError(this.handleError<Account>(`getAccount =${account}`))
    );
  }

  loginAccount(email: string,password: string): Observable<Account> {
    const url = `${this.accountUrl}/${email}/${password}`;
    return this.http.get<Account>(url).pipe(
      tap(_ => this.log(`fetched course=${email}`)),
      catchError(this.handleError<Account>(`getAccount =${email}`))
    );
  }
  
  getCourses(): Observable<Course[]> {
    this.messageService.add('CourseService: fetched courses');
    return this.http.get<Course[]>(this.coursesUrl)
    .pipe(
      tap(_ => this.log('fetched courses')),
      catchError(this.handleError<Course[]>('getCourses', []))
    );
  }

  getCourse(subject: string,catalog_nbr: string): Observable<Course> {
    const url = `${this.coursesUrl}/${subject}/${catalog_nbr}`;
    return this.http.get<Course>(url).pipe(
      tap(_ => this.log(`fetched course=${subject},${catalog_nbr}`)),
      catchError(this.handleError<Course>(`getCourse =${catalog_nbr}`))
    );
  }

  searchCourses(term: string): Observable<Course[]> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(term)){
      alert("invalid characters used");
    }
    else{
      var input = term.split(",");

      if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
      }
      return this.http.get<Course[]>(`${this.coursesUrl}/?subject=${input[0]}&catalog_nbr=${input[1]}&ssr_component=${input[2]}`).pipe(
        tap(x => x.length ?
          this.log(`found courses matching "${term}"`) :
          this.log(`no courses matching "${term}"`)),
        catchError(this.handleError<Course[]>('searchCourses', []))
      );
    }
  }

  private log(message: string) {
    this.messageService.add(`CourseService: ${message}`);
  }

  constructor(private http: HttpClient, private messageService: MessageService) { }
}
