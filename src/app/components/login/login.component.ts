import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { LoginRequest } from "../../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  show = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: "",
      password: ""
    })
  }

  submit(): void {
    const loginRequest: LoginRequest = {
      username: this.form.controls["username"].value,
      password: this.form.controls["password"].value
    };

    this.dialogRef.close(loginRequest);
  }

  toggleShowPassword(): void {
    this.show = !this.show;
  }
}
