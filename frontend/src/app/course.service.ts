import { Injectable } from '@angular/core';
import { Course } from './course';
import { Schedule } from './schedule';
import { Account } from './account';
import { Review } from './review';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesUrl = 'api/courses';
  private scheduleUrl = 'api/schedule';
  private accountUrl = 'api/account';
  private reviewUrl = 'api/review';
  private pageUrl = 'api/page';
  


  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token')})
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

  addSchedule(name: string, creator: string, publicStatus: string, description: string): Observable<Schedule> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        schedule: name,
        subject: " ",
        catalog_nbr: " ",
        creator: creator,
        public: publicStatus,
        description: description
      }

      const url = `${this.scheduleUrl}/create/`;
      return this.http.post<Schedule>(url, postData,this.httpOptions).pipe(
        tap(_ => this.log(`added schedule id=${name}`)),
        catchError(this.handleError<Schedule>('deleteSchedule'))
      );
    }
  }

  updateSchedule(name: string, creator: string,subject: string,catalog_nbr: string): Observable<Schedule> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(creator)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        schedule: name,
        subject: subject,
        catalog_nbr: catalog_nbr,
        creator: creator,
        public: " ",
        description: " ",
      }

      const url = `${this.scheduleUrl}`;
      return this.http.post<Schedule>(url, postData,this.httpOptions).pipe(
        tap(_ => this.log(`added schedule id=${name}`)),
        catchError(this.handleError<Schedule>('deleteSchedule'))
      );
    }
  }

  removeCourse(name: string, creator: string,subject: string,catalog_nbr: string): Observable<Schedule> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(creator)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        schedule: name,
        subject: subject,
        catalog_nbr: catalog_nbr,
        creator: creator,
        public: " ",
        description: " ",
      }

      const url = `${this.scheduleUrl}/remove`;
      return this.http.post<Schedule>(url, postData,this.httpOptions).pipe(
        tap(_ => this.log(`added schedule id=${name}`)),
        catchError(this.handleError<Schedule>('deleteSchedule'))
      );
    }
  }

  updateSchedulePub(name: string, creator: string,publicState: string): Observable<Schedule> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(creator)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(publicState)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        schedule: name,
        subject: " ",
        catalog_nbr: " ",
        creator: creator,
        public: publicState,
        description: " ",
      }

      const url = `${this.scheduleUrl}`;
      return this.http.post<Schedule>(url, postData,this.httpOptions).pipe(
        tap(_ => this.log(`added schedule id=${name}`)),
        catchError(this.handleError<Schedule>('deleteSchedule'))
      );
    }
  }

  updateScheduleDesc(name: string, creator: string,description: string): Observable<Schedule> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(name)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(creator)||/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(description)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        schedule: name,
        subject: " ",
        catalog_nbr: " ",
        creator: creator,
        public: " ",
        description: description,
      }

      const url = `${this.scheduleUrl}`;
      return this.http.post<Schedule>(url, postData,this.httpOptions).pipe(
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
    return this.http.post<Schedule>(url, postData,this.httpOptions).pipe(
      tap(_ => this.log(`added schedule id=${name}`)),
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  updateAccount(name: string,email: string,password: string,admin: string,activated: string): Observable<Schedule> {
    if(/[`!@#%^&*()_+\-=\[\]{};':"\\|<>\?~]/.test(password)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        name: name,
        email: email,
        password: password,
        admin: admin,
        activated: activated,
      }
  
      const url = `${this.accountUrl}`;
      return this.http.post<Schedule>(url, postData,this.httpOptions).pipe(
        tap(_ => this.log(`added schedule id=${name}`)),
        catchError(this.handleError<Schedule>('deleteSchedule'))
      );
    }
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
    return this.http.get<Account>(url,this.httpOptions).pipe(
      tap(_ => this.log(`fetched course=${account}`)),
      catchError(this.handleError<Account>(`getAccount =${account}`))
    );
  }

  loginAccount(email: string,password: string): Observable<Account> {
    var postData = {
      email: email,
      password: password,
    }
    const url = `${this.accountUrl}/login`;
    return this.http.post<Account>(url,postData).pipe(
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

  addReview(subject: string,catalog_nbr: string,review: string, name: string): Observable<Review> {
    if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(review)){
      alert("invalid characters used");
    }
    else{
      var postData = {
        subject: subject,
        catalog_nbr: catalog_nbr,
        review: review,
        name: name,
      }
      const url = `${this.reviewUrl}/create/`;
      return this.http.post<Review>(url, postData,this.httpOptions).pipe(
        tap(_ => this.log(`added review`)),
        catchError(this.handleError<Review>('review'))
      );
    }
  }

  getReview(subject: string,catalog_nbr: string): Observable<Review> {
    const url = `${this.reviewUrl}/${subject}${catalog_nbr}`;
    return this.http.get<Review>(url).pipe(
      tap(_ => this.log(`fetched review`)),
      catchError(this.handleError<Review>(`getReview =${catalog_nbr}`))
    );
  }

  hideReview(subject: string,catalog_nbr: string,review: string, name: string, time:string): Observable<Review> {
    var postData = {
      subject: subject,
      catalog_nbr: catalog_nbr,
      review: review,
      name: name,
      time: time,
    }
    const url = `${this.reviewUrl}/hidden/`;
    return this.http.post<Review>(url, postData,this.httpOptions).pipe(
      tap(_ => this.log(`added review`)),
      catchError(this.handleError<Review>('review'))
    );
  }

  searchCourses(term: string): Observable<Course[]> {
    if(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/.test(term)){
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

  getPage(page: string): Observable<object> {
    const url = `${this.pageUrl}/${page}`;
    return this.http.get<object>(url).pipe(
      tap(_ => this.log(`fetched page=${page}`)),
      catchError(this.handleError<object>(`getPage =${page}`))
    );
  }

  /*intercept(req: HttpRequest<any>, next: HttpHandler) {
      const authToken = this.authService.getToken();
      const authReq = req.clone({
          headers: req.headers.set("Authorize", authToken)
      });

      return next.handle(authReq);
  }*/

  private log(message: string) {
    this.messageService.add(`CourseService: ${message}`);
  }

  constructor(private http: HttpClient, private messageService: MessageService) { }
}
