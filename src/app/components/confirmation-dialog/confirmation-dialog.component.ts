import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent  {
  message: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

  close(response: boolean) {
    this.dialogRef.close(response);
  }
}
