import { Injectable } from '@angular/core';
import { HttpService } from "../http/http.service";
import { Observable } from "rxjs";
import { Playlist } from "../../models/playlist";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  readonly baseURL = "api";

  constructor(
    private http: HttpService
  ) { }

  createPlaylist(name: string) {
    return this.http.post(`${this.baseURL}/playlist`, `{"name":"${name}"}`);
  }

  addTrackToPlaylist(playlistId: string, trackId: string) {
    return this.http.post(`${this.baseURL}/playlist/${playlistId}/track/${trackId}`, null);
  }

  deleteTrackFromPlaylist(playlistId: string, trackId: string) {
    return this.http.delete(`${this.baseURL}/playlist/${playlistId}/track/${trackId}`);
  }

  deletePlaylist(id: string) {
    return this.http.delete(`${this.baseURL}/playlist/${id}`);
  }

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get(`${this.baseURL}/playlists`);
  }
}
