import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const ENDPOINT = 'http://localhost:9090/api/v1';
const HTTP_OPTIONS: Object = {
  headers: new HttpHeaders({'Content-Type':  'application/json'}),
  observe: 'response'
};

const headers = new Headers();
headers.append('Content-Type', 'multipart/form-data');
headers.append('Accept', 'application/json');

const HTTP_OPTIONS_FILE: Object = {
  headers: headers,
  observe: 'response'
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  private extractData(response: Response) {
    return response || { };
  }

  client(){
    return this.http;
  }
  
  getEndpoint(){
    return ENDPOINT;
  }

  gethttp(url): Observable<any> {
    return this.http.get(ENDPOINT + url, HTTP_OPTIONS).pipe(
      map(this.extractData));
  }

  posthttp(url, data): Observable<any> {
    return this.http.post(ENDPOINT + url, JSON.stringify(data), HTTP_OPTIONS).pipe(
      tap(_ => console.debug(`posted =${url}`)),
      catchError(this.handleError<any>('post'))
    );
  }

  posthttpFile(url, data): Observable<any> {
    return this.http.post(ENDPOINT + url, data, HTTP_OPTIONS_FILE).pipe(
      tap(_ => console.debug(`posted =${url}`)),
      catchError(this.handleError<any>('post'))
    );
  }  

  puthttp(url, data): Observable<any> {
    return this.http.put(ENDPOINT + url, JSON.stringify(data), HTTP_OPTIONS).pipe(
      tap(_ => console.debug(`updated =${url}`)),
      catchError(this.handleError<any>('put'))
    );
  }

  deletehttp(url): Observable<any> {
    return this.http.delete(ENDPOINT + url, HTTP_OPTIONS).pipe(
      tap(_ => console.debug(`deleted =${url}`)),
      catchError(this.handleError<any>('delete'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {  
      console.log(`${operation} failed: ${error.message}`, 'Error: ', error);
      return of(error as T);
    };
  }


}
