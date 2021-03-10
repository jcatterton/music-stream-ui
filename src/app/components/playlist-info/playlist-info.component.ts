import { Component, Input, OnInit } from '@angular/core';
import { Playlist } from "../../models/playlist";
import { TrackService } from "../../services/track/track.service";
import { Track } from "../../models/track";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { PlaylistService } from "../../services/playlist/playlist.service";
import { SnackBarPanelClass, SnackbarService } from "../../services/snackbar/snackbar.service";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-playlist-info',
  templateUrl: './playlist-info.component.html',
  styleUrls: ['./playlist-info.component.scss']
})
export class PlaylistInfoComponent implements OnInit {
  @Input() playlist: Playlist;
  tracks: Track[];

  constructor(
    private trackService: TrackService,
    private playlistService: PlaylistService,
    private dialogRef: MatDialogRef<PlaylistInfoComponent>,
    private snackBarService: SnackbarService,
    private dialogService: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTracks();
  }

  getTracks(): void {
    this.trackService.getTracks().subscribe(t => {
      this.tracks = t.filter(track => this.playlist.tracks.some(e => e === track.id))
    });
  }

  playAll(): void {
    this.dialogRef.close({output: this.tracks, type: "multiple"});
  }

  playOne(track: Track): void {
    this.dialogRef.close({output: track, type: "single" });
  }

  close(): void {
    this.dialogRef.close();
  }

  deletePlaylist(): void {
    const d = this.dialogService.open(ConfirmationDialogComponent, {width: "700px", disableClose: false});
    d.componentInstance.message = `Are you sure you want to delete ${this.playlist.name}?`;
    d.afterClosed().subscribe(response => {
      if (response) {
        this.playlistService.deletePlaylist(this.playlist.id).subscribe(() => {
          this.dialogRef.close();
        }, err => {
          console.log(err);
          this.snackBarService.showMessage("Error deleting playlist", SnackBarPanelClass.fail);
        });
      }
    });
  }

  removeTrackFromPlaylist(track: Track): void {
    const d = this.dialogService.open(ConfirmationDialogComponent, {width: "700px", disableClose: false});
    d.componentInstance.message = `Are you sure you want to remove ${track.name} from ${this.playlist.name}?`;
    d.afterClosed().subscribe(response => {
      if (response) {
        this.playlistService.deleteTrackFromPlaylist(this.playlist.id, track.id).subscribe(() => {
          this.snackBarService.showMessage("Track successfully removed from playlist", SnackBarPanelClass.success);
          this.playlist.tracks = this.playlist.tracks.filter(function(t) {
            return t !== track.id;
          });
          this.getTracks();
        }, err => {
          console.log(err);
          this.snackBarService.showMessage("Error removing track from playlist", SnackBarPanelClass.fail);
        });
      }
    });
  }
}
