import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {FormBuilder} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {MockMatDialog} from "../../mocks/services";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fb = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should call formBuilder group", () => {
      const groupSpy = spyOn(fb, "group");
      component.ngOnInit();
      expect(groupSpy).toHaveBeenCalled();
    });
  });

  describe("submit", () => {
    it("should call dialogRef close", () => {
      component.form.controls["username"].setValue("testUsername");
      component.form.controls["password"].setValue("testPassword");
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.submit();
      expect(closeSpy).toHaveBeenCalledWith({username: "testUsername", password: "testPassword"});
    });
  });

  describe("toggleShowPassword", () => {
    it("should set show to true if it was false", () => {
      component.show = false;
      component.toggleShowPassword();
      expect(component.show).toBeTruthy();
    });

    it("should set show to false if it was true", () => {
      component.show = true;
      component.toggleShowPassword();
      expect(component.show).toBeFalsy();
    });
  });
});
