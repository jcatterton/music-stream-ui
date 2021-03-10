import { Observable, of } from "rxjs";
import { MatDialogConfig } from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/portal";
import { Track} from "../models/track";
import { MockTrack } from "./tracks";
import { Playlist } from "../models/playlist";
import { SnackBarPanelClass } from "../services/snackbar/snackbar.service";

export class MockMatDialog {
  open(component: ComponentType<any>, config?: MatDialogConfig) {
    return{
      afterClosed() {
        return of({});
      }
    }
  }

  close(dialogResult?: any): void {};
}

export class MockTrackService {
  uploadTrack(formData: FormData) {
    return of(null);
  }

  getTrackAudio(id: string) {
    return of(null);
  }

  updateTrack(id: string, body: Track) {
    return of(null);
  }

  deleteTrack(id: string) {
    return of(null);
  }

  getTracks(): Observable<Track[]> {
    return of(MockTrack.mockTracks);
  }

  getAudioUrl(track: Track): string {
    return "test";
  }
}

export class MockPlaylistService {
  createPlaylist(name: string) {
    return of(null);
  }

  addTrackToPlaylist(playlistId: string, trackId: string) {
    return of(null);
  }

  deleteTrackFromPlaylist(playlistId: string, trackId: string) {
    return of(null);
  }

  deletePlaylist(id: string) {
    return of(null);
  }

  getPlaylists(): Observable<Playlist[]> {
    return of(null);
  }
}

export class MockSnackBarService {
  showMessage(msg: string, panelClass: SnackBarPanelClass) {};
}

export class MockHttpService {
  get<T>(url: string): Observable<any> {
    return of(null);
  }

  post<T>(url: string, body: any): Observable<any> {
    return of(null);
  }

  put<T>(url: string, body: any): Observable<any> {
    return of(null);
  }

  delete<T>(url: string): Observable<any> {
    return of(null);
  }
}
