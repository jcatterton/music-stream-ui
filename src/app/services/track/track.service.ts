import { Injectable } from '@angular/core';
import { HttpService } from "../http/http.service";
import {ConversionRequest, Track, UploadRequest, YoutubeRequest} from "../../models/track";
import { Observable } from "rxjs";
import {Video} from "../../models/video";

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  readonly baseURL = "api";

  constructor(
    private http: HttpService
  ) { }

  uploadTrack(formData: FormData) {
    return this.http.post(`${this.baseURL}/track`, formData);
  }

  getTrackAudio(id: string) {
    return this.http.get(`${this.baseURL}/track/${id}`)
  }

  updateTrack(id: string, body: Track) {
    return this.http.put(`${this.baseURL}/track/${id}`, body)
  }

  deleteTrack(id: string) {
    return this.http.delete(`${this.baseURL}/track/${id}`)
  }

  getTracks(): Observable<Track[]> {
    return this.http.get(`${this.baseURL}/tracks`)
  }

  getAudioUrl(track: Track) {
    return `${this.baseURL}/track/${track.id}`
  }

  getVideo(body: YoutubeRequest) {
    return this.http.post(`${this.baseURL}/video`, body);
  }

  getStream(body: Video) {
    return this.http.post(`${this.baseURL}/stream`, body);
  }

  convertStreamToAudio(body: string) {
    const cr = {
      bytes: body
    } as ConversionRequest;
    return this.http.post(`${this.baseURL}/convert`, cr);
  }

  uploadAudio(body: UploadRequest) {
    return this.http.post(`${this.baseURL}/upload`, body);
  }

  // Deprecated
  uploadTrackFromYoutube(track: YoutubeRequest) {
    return this.http.post(`${this.baseURL}/youtube/track`, track);
  }
}
