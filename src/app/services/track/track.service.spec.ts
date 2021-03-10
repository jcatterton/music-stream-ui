import { TestBed } from '@angular/core/testing';
import { TrackService } from './track.service';
import { MockHttpService } from "../../mocks/services";
import { HttpService } from "../http/http.service";
import { MockTrack } from "../../mocks/tracks";

describe('TrackService', () => {
  let service: TrackService;
  let httpService: HttpService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpService, useClass: MockHttpService }
    ]
  }).compileComponents());

  beforeEach(() => {
    service = TestBed.inject(TrackService);
    httpService = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    const service: TrackService = TestBed.get(TrackService);
    expect(service).toBeTruthy();
  });

  describe("uploadTrack", () => {
    it("should call http post", () => {
      const postSpy = spyOn(httpService, "post");
      service.uploadTrack(null);
      expect(postSpy).toHaveBeenCalledWith(`${service.baseURL}/track`, null);
    });
  });

  describe("getTrackAudio", () => {
    it("should call http get", () => {
      const getSpy = spyOn(httpService, "get");
      service.getTrackAudio("test");
      expect(getSpy).toHaveBeenCalledWith(`${service.baseURL}/track/test`);
    });
  });

  describe("updateTrack", () => {
    it("should call http put", () => {
      const putSpy = spyOn(httpService, "put");
      service.updateTrack("test", null);
      expect(putSpy).toHaveBeenCalledWith(`${service.baseURL}/track/test`, null);
    });
  });

  describe("deleteTrack", () => {
    it("should call http delete", () => {
      const deleteSpy = spyOn(httpService, "delete");
      service.deleteTrack("test");
      expect(deleteSpy).toHaveBeenCalledWith(`${service.baseURL}/track/test`);
    });
  });

  describe("getTracks", () => {
    it("should call http get", () => {
      const getSpy = spyOn(httpService, "get");
      service.getTracks();
      expect(getSpy).toHaveBeenCalledWith(`${service.baseURL}/tracks`);
    });
  });

  describe("getAudioUrl", () => {
    it("should return formatted url", () => {
      const result = service.getAudioUrl(MockTrack.mockTrack1);
      expect(result).toEqual(`${service.baseURL}/track/${MockTrack.mockTrack1.id}`);
    });
  });
});
