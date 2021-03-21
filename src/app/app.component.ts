import { Component, OnInit } from '@angular/core';
import { LoginComponent } from "./components/login/login.component";
import { MatDialog } from "@angular/material/dialog";
import { LoginService } from "./services/login/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'music-stream-ui';

  constructor(
    private dialogService: MatDialog,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.handleLogin();
  }

  handleLogin(): void {
    if (localStorage.getItem("justin-token") !== null) {
      this.loginService.validateToken().subscribe(() => {
        this.router.navigate(["music-player"]);
      }, () => {
        if (this.dialogService.openDialogs.length === 0) {
          this.showLoginDialog();
        }
      })
    } else {
      if (this.dialogService.openDialogs.length === 0) {
        this.showLoginDialog();
      }
    }
  }

  showLoginDialog(): void {
    const dialogRef = this.dialogService.open(LoginComponent, { width: "400px", disableClose: true });
    dialogRef.afterClosed().subscribe(response => {
      this.loginService.generateToken(response).subscribe(token => {
        localStorage.setItem("justin-token", token as string);
        this.router.navigate(["music-player"]);
      }, () => {
        this.showLoginDialog();
      });
    });
  }
}
