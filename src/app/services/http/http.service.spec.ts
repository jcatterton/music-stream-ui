import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HttpService', () => {
  let service: HttpService;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService]
    });

    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    const service: HttpService = TestBed.get(HttpService);
    expect(service).toBeTruthy();
  });

  describe("get", () => {
    it("should return http get", () => {
      let response;
      service.get("test").subscribe(data => {
        response = data;
      }, err => {
        response = err;
      });
      const req = httpMock.expectOne("test");
      expect(req.request.method).toEqual("GET");
    });
  });

  describe("post", () => {
    it("should return http post", () => {
      let response;
      service.post("test", null).subscribe(data => {
        response = data;
      }, err => {
        response = err;
      });
      const req = httpMock.expectOne("test");
      expect(req.request.method).toEqual("POST");
    });
  });

  describe("put", () => {
    it("should return http put", () => {
      let response;
      service.put("test", null).subscribe(data => {
        response = data;
      }, err => {
        response = err;
      });
      const req = httpMock.expectOne("test");
      expect(req.request.method).toEqual("PUT");
    });
  });

  describe("delete", () => {
    it("should return http delete", () => {
      let response;
      service.delete("test").subscribe(data => {
        response = data;
      }, err => {
        response = err;
      });
      const req = httpMock.expectOne("test");
      expect(req.request.method).toEqual("DELETE");
    });
  });
});
