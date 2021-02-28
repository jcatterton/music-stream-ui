import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

export enum SnackBarPanelClass {
  fail = "snack-bar-fail",
  success = "snack-bar-success"
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) { }

  showMessage(msg: string, panelClass: SnackBarPanelClass) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = panelClass;
    this.snackbar.open(msg, "x", config);
  }
}
