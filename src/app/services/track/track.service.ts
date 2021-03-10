import { Injectable } from '@angular/core';
import { HttpService } from "../http/http.service";
import { Track } from "../../models/track";
import { Observable } from "rxjs";

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
}
