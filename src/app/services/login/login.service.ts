import { Injectable } from '@angular/core';
import { HttpService } from "../http/http.service";
import { LoginRequest } from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly baseURL = "auth";

  constructor(
    private http: HttpService
  ) { }

  generateToken(user: LoginRequest) {
    return this.http.post(`${this.baseURL}/login`, user);
  }

  validateToken() {
    return this.http.post(`${this.baseURL}/token`, null)
  }
}
