import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  headers: any;

  constructor(
    private http: HttpClient,
  ) { }

  get<T>(url: string): Observable<T> {
    this.headers = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem("justin-token")}`});
    return this.http.get<T>(url, {headers: this.headers});
  }

  post<T>(url: string, body: any): Observable<T> {
    this.headers = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem("justin-token")}`});
    return this.http.post<T>(url, body, {headers: this.headers});
  }

  put<T>(url: string, body: any): Observable<T> {
    this.headers = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem("justin-token")}`});
    return this.http.put<T>(url, body, {headers: this.headers});
  }

  delete<T>(url: string): Observable<T> {
    this.headers = new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem("justin-token")}`});
    return this.http.delete<T>(url, {headers: this.headers});
  }
}
