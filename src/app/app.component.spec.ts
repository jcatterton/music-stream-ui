import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MockLoginService, MockMatDialog } from "./mocks/services";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { LoginService } from "./services/login/login.service";
import { of, throwError } from "rxjs";

describe('AppComponent', () => {
  let fixture;
  let app;
  let router;
  let loginService: MockLoginService;
  let dialogService: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: MatDialog, useClass: MatDialog },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: LoginService, useClass: MockLoginService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    loginService = TestBed.inject(LoginService);
    dialogService = TestBed.inject(MatDialog);

    let store = {};
    spyOn(localStorage, "getItem").and.callFake(function(key){ return store[key] } );
    spyOn(localStorage, "setItem").and.callFake(function(key, value){ store[key] = value });
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'music-stream-ui'`, () => {
    expect(app.title).toEqual('music-stream-ui');
  });

  describe("ngOnInit", () => {
    it("should call handleLogin()", () => {
      const handleLoginSpy = spyOn(app, "handleLogin");
      app.ngOnInit();
      expect(handleLoginSpy).toHaveBeenCalled();
    });
  });

  describe("handleLogin", () => {
    it("should call router navigate if token is exists and is valid", () => {
      localStorage.setItem("justin-token", "test");
      spyOn(loginService, "validateToken").and.returnValue(of(null));
      const navigateSpy = spyOn(router, "navigate");
      app.handleLogin();
      expect(navigateSpy).toHaveBeenCalledWith(["music-player"]);
    });

    it("should call showLoginDialog if token exists but is not valid", () => {
      localStorage.setItem("justin-token", "test");
      spyOn(loginService, "validateToken").and.returnValue(throwError("test"));
      const showLoginSpy = spyOn(app, "showLoginDialog");
      dialogService.closeAll();
      app.handleLogin();
      expect(showLoginSpy).toHaveBeenCalled();
    });

    it("should call showLoginDialog if token does not exist", () => {
      localStorage.setItem("justin-token", null);
      const showLoginSpy = spyOn(app, "showLoginDialog");
      dialogService.closeAll();
      app.handleLogin();
      expect(showLoginSpy).toHaveBeenCalled();
    });
  });

  describe("showLoginDialog", () => {
    it("should call navigate if login is successful", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(loginService, "generateToken").and.returnValue(of("testToken"));
      const navigateSpy = spyOn(router, "navigate");
      app.showLoginDialog();
      expect(navigateSpy).toHaveBeenCalledWith(["music-player"]);
      expect(localStorage.getItem("justin-token")).toEqual("testToken");
    });

    it("should call showLoginDialog if login fails", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(loginService, "generateToken").and.returnValue(throwError("test"));
      const showLoginSpy = spyOn(app, "showLoginDialog").and.callThrough();
      app.showLoginDialog();
      expect(showLoginSpy).toHaveBeenCalled();
    });
  });
});
