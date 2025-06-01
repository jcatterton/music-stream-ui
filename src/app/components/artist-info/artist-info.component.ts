import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Album } from "../../models/album";
import { Artist } from "../../models/artist";

@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.scss']
})
export class ArtistInfoComponent {
  artist: Artist;

  constructor(
    private dialogRef: MatDialogRef<ArtistInfoComponent>,
  ) { }

  playAll(): void {
    let allTracks = [];
    this.artist.albums.forEach(a => {
      allTracks = allTracks.concat(a.tracks);
    });
    this.dialogRef.close({output: allTracks, type: "tracks"});
  }

  shuffleAll(): void {
    let allTracks = [];
    this.artist.albums.forEach(a => {
      allTracks = allTracks.concat(a.tracks);
    });
    this.dialogRef.close({output: allTracks, type: "shuffle"});
  }

  selectAlbum(album: Album): void {
    this.dialogRef.close({output: album, type: "album"});
  }

  close(): void {
    this.dialogRef.close();
  }
}
