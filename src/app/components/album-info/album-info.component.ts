import { Component } from '@angular/core';
import { Track } from "../../models/track";
import { MatDialogRef } from "@angular/material/dialog";
import { Album } from "../../models/album";

@Component({
  selector: 'app-album-info',
  templateUrl: './album-info.component.html',
  styleUrls: ['./album-info.component.scss']
})
export class AlbumInfoComponent {
  album: Album;

  constructor(
    private dialogRef: MatDialogRef<AlbumInfoComponent>,
  ) { }

  playAll(): void {
    this.dialogRef.close({output: this.album.tracks, type: "multiple"});
  }

  playOne(track: Track): void {
    this.dialogRef.close({output: track, type: "single" });
  }

  shuffleAll(): void {
    this.dialogRef.close({output: this.album.tracks, type: "shuffle"});
  }

  close(): void {
    this.dialogRef.close();
  }

  goToArtist(): void {
    this.dialogRef.close({output: this.album.artist, type: "artist"})
  }
}
