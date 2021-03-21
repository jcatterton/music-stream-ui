import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockHttpService } from "../../mocks/services";
import { HttpService } from "../http/http.service";

describe('LoginService', () => {
  let service: LoginService;
  let httpService: MockHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: HttpService, useClass: MockHttpService }
      ]
    });
    service = TestBed.inject(LoginService);
    httpService = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("generateToken", () => {
    it("should call http post", () => {
      const postSpy = spyOn(httpService, "post");
      service.generateToken({username: "test", password: "test"});
      expect(postSpy).toHaveBeenCalledWith(`${service.baseURL}/login`, {username: "test", password: "test"})
    });
  });

  describe("validateToken", () => {
    it("should call http post", () => {
      const postSpy = spyOn(httpService, "post");
      service.validateToken();
      expect(postSpy).toHaveBeenCalledWith(`${service.baseURL}/token`, null);
    });
  });
});
