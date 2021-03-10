import { TestBed } from '@angular/core/testing';
import { PlaylistService } from './playlist.service';
import { MockHttpService } from "../../mocks/services";
import { HttpService } from "../http/http.service";

describe('PlaylistService', () => {
  let service: PlaylistService;
  let httpService: MockHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService }
      ]
    });

    service = TestBed.inject(PlaylistService);
    httpService = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("createPlaylist", () => {
    it("should return http post", () => {
      const postSpy = spyOn(httpService, "post");
      service.createPlaylist("test");
      expect(postSpy).toHaveBeenCalledWith(`${service.baseURL}/playlist`, `{"name":"test"}`);
    });
  });

  describe("addTrackToPlaylist", () => {
    it("should call http post", () => {
      const postSpy = spyOn(httpService, "post");
      service.addTrackToPlaylist("test", "test");
      expect(postSpy).toHaveBeenCalledWith(`${service.baseURL}/playlist/test/track/test`, null);
    });
  });

  describe("deleteTrackFromPlaylist", () => {
    it("should call http delete", () => {
      const deleteSpy = spyOn(httpService, "delete");
      service.deleteTrackFromPlaylist("test", "test");
      expect(deleteSpy).toHaveBeenCalledWith(`${service.baseURL}/playlist/test/track/test`);
    });
  });

  describe("deletePlaylist", () => {
    it("should call http delete", () => {
      const deleteSpy = spyOn(httpService, "delete");
      service.deletePlaylist("test");
      expect(deleteSpy).toHaveBeenCalledWith(`${service.baseURL}/playlist/test`);
    });
  });

  describe("getPlaylists", () => {
    it("should call http get", () => {
      const getSpy = spyOn(httpService, "get");
      service.getPlaylists();
      expect(getSpy).toHaveBeenCalledWith(`${service.baseURL}/playlists`);
    });
  });
});
