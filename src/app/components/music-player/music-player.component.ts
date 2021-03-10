import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Track, UploadTrackRequest } from "../../models/track";
import { TrackService } from "../../services/track/track.service";
import { SnackBarPanelClass, SnackbarService } from "../../services/snackbar/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { AddTrackComponent } from "../add-track/add-track.component";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { AddPlaylistComponent } from "../add-playlist/add-playlist.component";
import { PlaylistService } from "../../services/playlist/playlist.service";
import { Playlist } from "../../models/playlist";
import { MatTableDataSource } from "@angular/material/table";
import { AddTrackToPlaylistComponent } from "../add-track-to-playlist/add-track-to-playlist.component";
import { PlaylistInfoComponent } from "../playlist-info/playlist-info.component";
import { MatSort } from "@angular/material/sort";
import { Album } from "../../models/album";
import { AlbumInfoComponent } from "../album-info/album-info.component";
import { Artist } from "../../models/artist";
import { ArtistInfoComponent } from "../artist-info/artist-info.component";
import { Title } from "@angular/platform-browser";
import { UpdateTrackComponent } from "../update-track/update-track.component";
import { RowDef } from "../../mocks/rowdef";

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {
  tracks: Track[];
  activeTrack: Track;
  playableTracks: Track[];
  playableIndex: number;
  $player: HTMLAudioElement;
  shuffle: boolean;
  loop: boolean;
  playlists: Playlist[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columns: String[];
  rowDef: string;
  albums: Album[];
  artists: Artist[];
  firstLoad = true;

  @ViewChild('stream') set playerRef(ref: ElementRef<HTMLAudioElement>) {
    this.$player = ref.nativeElement;
  }
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private trackService: TrackService,
    private snackBarService: SnackbarService,
    private dialogService: MatDialog,
    private playlistService: PlaylistService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.loadTracks();
    this.shuffle = false;
    this.loop = false;
  }

  loadTracks(): void {
    this.trackService.getTracks().subscribe(tracks => {
      this.tracks = tracks;
      this.loadPlaylists();
    }, err => {
      this.snackBarService.showMessage("Error loading tracks", SnackBarPanelClass.fail)
    });
  }

  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe(playlists => {
      this.playlists = playlists;
      this.loadAlbums();
    }, err => {
      this.snackBarService.showMessage("Error loading playlists", SnackBarPanelClass.fail);
    });
  }

  loadAlbums(): void {
    let albums = [];
    this.tracks.forEach(t => {
      if (!albums.some(a => a.name === t.album)) {
        albums = albums.concat({ name: t.album, artist: t.artist, tracks: [t] });
      } else {
        let album = albums.find(a => a.name === t.album);
        album.tracks = album.tracks.concat(t);
      }
    });
    this.albums = albums;
    this.loadArtists();
  }

  loadArtists(): void {
    let artists = [];
    this.albums.forEach(a => {
      if (!artists.some(art => art.name === a.artist)) {
        artists = artists.concat({ name: a.artist, albums: [a] });
      } else {
        let artist = artists.find(art => art.name === a.artist);
        artist.albums = artist.albums.concat(a);
      }
    });
    this.artists = artists;
    if (this.firstLoad) {
      this.setRowDef(RowDef.tracks);
      this.firstLoad = false;
    } else {
      this.refreshDataSource();
    }
  }

  handleClick(row): void {
    if (this.rowDef === RowDef.tracks) {
      this.playableTracks = [];
      this.playableIndex = 0;
      this.playTrack(row);
    } else if (this.rowDef === RowDef.playlists) {
      this.openPlaylistInfo(row);
    } else if (this.rowDef === RowDef.albums) {
      this.openAlbumInfo(row);
    } else if (this.rowDef === RowDef.artists) {
      this.openArtistInfo(row);
    }
  }

  playTrack(track: Track): void {
    this.$player.src = this.trackService.getAudioUrl(track);
    this.$player.load();
    this.$player.play();
    this.activeTrack = track;
    this.titleService.setTitle(`${this.activeTrack.name} - ${this.activeTrack.artist}`);
  }

  playAll(): void {
    this.playableTracks = this.shuffle ? MusicPlayerComponent.shuffleTracks(this.tracks) : this.tracks;
    this.playableIndex = 0;
    this.playTrack(this.playableTracks[this.playableIndex]);
  }

  openPlaylistInfo(playlist: Playlist): void {
    const dialogRef = this.dialogService.open(PlaylistInfoComponent, { width: "700px", disableClose: false });
    dialogRef.componentInstance.playlist = playlist;
    dialogRef.afterClosed().subscribe(output => {
      if (output) {
        if (output.type === "multiple") {
          this.playableTracks = output.output;
          this.playableIndex = 0;
          this.shuffle ? MusicPlayerComponent.shuffleTracks(this.playableTracks) : {};
          this.playTrack(this.playableTracks[0]);
        } else if (output.type === "single") {
          this.playableTracks = [];
          this.playableIndex = 0;
          this.playTrack(output.output);
        }
      } else {
        this.loadPlaylists();
      }
    });
  }

  openAlbumInfo(album: Album): void {
    const dialogRef = this.dialogService.open(AlbumInfoComponent, { width: "700px", disableClose: false });
    dialogRef.componentInstance.album = album;
    dialogRef.afterClosed().subscribe(output => {
      if (output) {
        if (output.type === "multiple") {
          this.playableTracks = output.output;
          this.playableIndex = 0;
          this.shuffle ? MusicPlayerComponent.shuffleTracks(this.playableTracks) : {};
          this.playTrack(this.playableTracks[0]);
        } else if (output.type === "single") {
          this.playableTracks = [];
          this.playableIndex = 0;
          this.playTrack(output.output);
        } else if (output.type === "artist") {
          this.openArtistInfo(this.artists.find(a => a.name === output.output));
        }
      }
    });
  }

  openArtistInfo(artist: Artist): void {
    const dialogRef = this.dialogService.open(ArtistInfoComponent, { width: "700px", disableClose: false });
    dialogRef.componentInstance.artist = artist;
    dialogRef.afterClosed().subscribe(output => {
      if (output) {
        if (output.type === "album") {
          this.openAlbumInfo(output.output);
        } else if (output.type === "tracks") {
          this.playableTracks = output.output;
          this.playableIndex = 0;
          this.shuffle ? MusicPlayerComponent.shuffleTracks(this.playableTracks) : {};
          this.playTrack(this.playableTracks[0]);
        }
      }
    });
  }

  addTrack(): void {
    const dialogRef = this.dialogService.open(AddTrackComponent, { width: "700px", disableClose: false });
    dialogRef.afterClosed().subscribe((track: UploadTrackRequest) => {
      if (track !== undefined) {
        if (this.tracks.some(t => t.name.toLowerCase() === track.name.toLowerCase() && t.album.toLowerCase() === track.album.toLowerCase() && t.artist.toLowerCase() === track.artist.toLowerCase())) {
          const d = this.dialogService.open(ConfirmationDialogComponent, {width: "700px", disableClose: false});
          d.componentInstance.message = "A track with the same name, artist, and album already exists. Add anyway?";
          d.afterClosed().subscribe(response => {
            if (response) {
              const fd = new FormData();
              fd.set("input", track.audioFile);
              fd.set("body", MusicPlayerComponent.buildBodyFromTrack(track));
              this.trackService.uploadTrack(fd).subscribe(() => {
                this.snackBarService.showMessage("Track added successfully", SnackBarPanelClass.success);
                this.loadTracks();
              }, err => {
                console.log(err);
                this.snackBarService.showMessage("Error adding tracks", SnackBarPanelClass.fail)
              })
            }
          })
        } else {
          const fd = new FormData();
          fd.set("input", track.audioFile);
          fd.set("body", MusicPlayerComponent.buildBodyFromTrack(track));
          this.trackService.uploadTrack(fd).subscribe(() => {
            this.snackBarService.showMessage("Track added successfully", SnackBarPanelClass.success);
            this.loadTracks();
          }, err => {
            console.log(err);
            this.snackBarService.showMessage("Error adding tracks", SnackBarPanelClass.fail)
          })
        }
      }
    });
  }

  delete(row): void {
    if (this.rowDef === RowDef.tracks) {
      this.deleteTrack(row);
    } else if (this.rowDef === RowDef.playlists) {
      this.deletePlaylist(row);
    }
  }

  deleteTrack(track: Track): void {
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, { width: "400px", disableClose: true });
    dialogRef.componentInstance.message = `Are you sure you want to delete ${track.name}?`;
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.trackService.deleteTrack(track.id).subscribe(() => {
          this.snackBarService.showMessage("Track deleted successfully", SnackBarPanelClass.success);
          this.loadTracks();
        }, err => {
          console.log(err);
          this.snackBarService.showMessage("Error deleting track", SnackBarPanelClass.fail);
        });
      }
    });
  }

  deletePlaylist(playlist: Playlist): void {
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, { width: "400px", disableClose: true });
    dialogRef.componentInstance.message = `Are you sure you want to delete ${playlist.name}?`;
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.playlistService.deletePlaylist(playlist.id).subscribe(() => {
          this.snackBarService.showMessage("Playlist deleted successfully", SnackBarPanelClass.success);
          this.loadTracks();
        }, err => {
          console.log(err);
          this.snackBarService.showMessage("Error deleting playlist", SnackBarPanelClass.fail);
        });
      }
    });
  }

  addPlaylist(): void {
    const dialogRef = this.dialogService.open(AddPlaylistComponent, { width: "700px", disableClose: false });
    dialogRef.afterClosed().subscribe((playlistName: string) => {
      if (this.playlists?.some(p => p.name === playlistName)) {
        this.snackBarService.showMessage("Playlist with that name already exists", SnackBarPanelClass.fail);
      } else if (playlistName !== undefined) {
        this.playlistService.createPlaylist(playlistName).subscribe(() => {
          this.snackBarService.showMessage("Playlist added successfully", SnackBarPanelClass.success);
          this.loadTracks();
        }, err => {
          console.log(err);
          this.snackBarService.showMessage("Error adding tracks", SnackBarPanelClass.fail)
        })
      }
    });
  }

  addTrackToPlaylist(track: Track): void {
    if (this.playlists.length !== 0) {
      const dialogRef = this.dialogService.open(AddTrackToPlaylistComponent, {width: "700px", disableClose: false});
      dialogRef.componentInstance.playlists = this.playlists;
      dialogRef.componentInstance.trackName = track.name;
      dialogRef.afterClosed().subscribe((playlistId: string) => {
        if (playlistId !== undefined) {
          if (this.playlists.find(p => p.id === playlistId).tracks?.some(t => t === track.id)) {
            this.snackBarService.showMessage("Track already exists in playlist", SnackBarPanelClass.fail);
          } else {
            this.playlistService.addTrackToPlaylist(playlistId, track.id).subscribe(() => {
              this.snackBarService.showMessage("Track successfully added to playlist", SnackBarPanelClass.success);
              this.loadTracks();
            }, err => {
              console.log(err);
              this.snackBarService.showMessage("Error adding track to playlist", SnackBarPanelClass.fail);
            });
          }
        }
      });
    } else {
      this.snackBarService.showMessage("No playlists exist", SnackBarPanelClass.fail);
    }
  }

  updateTrack(track: Track): void {
    const dialogRef = this.dialogService.open(UpdateTrackComponent, {width: "700px", disableClose: false});
    dialogRef.componentInstance.track = track;
    dialogRef.afterClosed().subscribe(output => {
      if (output !== undefined) {
        this.trackService.updateTrack(track.id, output).subscribe(() => {
          this.snackBarService.showMessage("Track updated successfully", SnackBarPanelClass.success);
          this.loadTracks();
        }, err => {
          console.log(err);
          this.snackBarService.showMessage("Error updating track", SnackBarPanelClass.fail);
        });
      }
    });
  }

  sortArtists(sortEvent): void {
    if (sortEvent.direction === "") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Artist, y: Artist) {
        return x.name.toLowerCase().localeCompare(y.name.toLowerCase());
      });
    } else if (sortEvent.active === "name") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Artist, y: Artist) {
        return sortEvent.direction === "asc" ? x.name.toLowerCase().localeCompare(y.name.toLowerCase()) : y.name.toLowerCase().localeCompare(x.name.toLowerCase());
      });
    } else if (sortEvent.active === "albums") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Artist, y: Artist) {
        if (sortEvent.direction === "desc") {
          if (x.albums?.length > y.albums?.length) {
            return 1;
          } else if (x.albums?.length < y.albums?.length) {
            return -1;
          }
          return 0;
        } else if (sortEvent.direction === "asc") {
          if (y.albums?.length > x.albums?.length) {
            return 1;
          } else if (y.albums?.length < x.albums?.length) {
            return -1;
          }
          return 0;
        }
      });
    }
  }

  sortAlbums(sortEvent): void {
    if (sortEvent.direction === "") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Album, y: Album) {
        return x.name.toLowerCase().localeCompare(y.name.toLowerCase());
      });
    } else if (sortEvent.active === "name") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Album, y: Album) {
        return sortEvent.direction === "asc" ? x.name.toLowerCase().localeCompare(y.name.toLowerCase()) : y.name.toLowerCase().localeCompare(x.name.toLowerCase());
      });
    } else if (sortEvent.active === "artist") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Album, y: Album) {
        return sortEvent.direction === "asc" ? x.artist.toLowerCase().localeCompare(y.artist.toLowerCase()) : y.artist.toLowerCase().localeCompare(x.artist.toLowerCase());
      });
    } else if (sortEvent.active === "tracks") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Album, y: Album) {
        if (sortEvent.direction === "desc") {
          if (x.tracks?.length > y.tracks?.length) {
            return 1;
          } else if (x.tracks?.length < y.tracks?.length) {
            return -1;
          }
          return 0;
        } else if (sortEvent.direction === "asc") {
          if (y.tracks?.length > x.tracks?.length) {
            return 1;
          } else if (y.tracks?.length < x.tracks?.length) {
            return -1;
          }
          return 0;
        }
      });
    }
  }

  sortPlaylists(sortEvent): void {
    if (sortEvent.direction === "") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Playlist, y: Playlist) {
        return x.name.toLowerCase().localeCompare(y.name.toLowerCase());
      });
    } else if (sortEvent.active === "name") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Playlist, y: Playlist) {
        return sortEvent.direction === "asc" ? x.name.toLowerCase().localeCompare(y.name.toLowerCase()) : y.name.toLowerCase().localeCompare(x.name.toLowerCase());
      });
    } else if (sortEvent.active === "tracks") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Playlist, y: Playlist) {
        if (sortEvent.direction === "asc") {
          if (x.tracks?.length > y.tracks?.length) {
            return 1;
          } else if (x.tracks?.length < y.tracks?.length) {
            return -1;
          }
          return 0;
        } else if (sortEvent.direction === "desc") {
          if (y.tracks?.length > x.tracks?.length) {
            return 1;
          } else if (y.tracks?.length < x.tracks?.length) {
            return -1;
          }
          return 0;
        }
      });
    }
  }

  sortTracks(sortEvent): void {
    if (sortEvent.direction === "") {
      this.dataSource.data = this.dataSource.data.sort(function(x: Track, y: Track) {
        if (x.artist.localeCompare(y.artist) > 0) {
          return 1;
        } else if (x.artist.localeCompare(y.artist) < 0) {
          return -1;
        } else {
          if (x.album.localeCompare(y.album) > 0) {
            return 1;
          } else if (x.album.localeCompare(y.album) < 0) {
            return -1;
          } else {
            return x.name.localeCompare(y.name);
          }
        }
      })
    } else if (sortEvent.active === "name") {
      this.dataSource.data = this.dataSource.data.sort(function (x: Track, y: Track) {
        return sortEvent.direction === "asc" ? x.name.localeCompare(y.name) : y.name.localeCompare(x.name);
      })
    } else if (sortEvent.active === "artist") {
      this.dataSource.data = this.dataSource.data.sort(function (x: Track, y: Track) {
        return sortEvent.direction === "asc" ? x.artist.localeCompare(y.artist) : y.artist.localeCompare(x.artist);
      })
    } else if (sortEvent.active === "album") {
      this.dataSource.data = this.dataSource.data.sort(function (x: Track, y: Track) {
        return sortEvent.direction === "asc" ? x.album.localeCompare(y.album) : y.album.localeCompare(x.album);
      })
    }
  }

  refreshDataSource(): void {
    if (this.rowDef === RowDef.tracks) {
      this.dataSource.data = this.tracks;
      this.sortTracks({active: "", direction: ""});
    } else if (this.rowDef === RowDef.playlists) {
      this.dataSource.data = this.playlists;
      this.sortPlaylists({active: "", direction: ""});
    } else if (this.rowDef === RowDef.artists) {
      this.dataSource.data = this.artists;
      this.sortArtists({active: "", direction: ""});
    } else if (this.rowDef === RowDef.albums) {
      this.dataSource.data = this.albums;
      this.sortAlbums({active: "", direction: ""})
    }
  }

  setRowDef(rowDef: string): void {
    if (this.rowDef === rowDef) {
      return;
    }
    this.rowDef = rowDef;
    if (this.rowDef === RowDef.tracks) {
      this.columns = ['name', 'artist', 'album', 'options'];
    } else if (rowDef === RowDef.playlists) {
      this.columns = ['name', 'tracks', 'options'];
    } else if (rowDef === RowDef.albums) {
      this.columns = ['name', 'artist', 'tracks'];
    } else if (rowDef === RowDef.artists) {
      this.columns = ['name', 'albums'];
    }
    this.refreshDataSource();
  }

  filterChanged(filterValue: string): void {
    filterValue = filterValue.toLowerCase();
    if (this.rowDef === RowDef.tracks) {
      this.dataSource.data = this.tracks.filter(t =>
        t.name.toLowerCase().includes(filterValue) ||
        t.artist.toLowerCase().includes(filterValue) ||
        t.album.toLowerCase().includes(filterValue)
      );
    } else if (this.rowDef === RowDef.playlists) {
      this.dataSource.data = this.playlists.filter(p =>
        p.name.toLowerCase().includes(filterValue)
      )
    } else if (this.rowDef === RowDef.albums) {
      this.dataSource.data = this.albums.filter(a =>
        a.name.toLowerCase().includes(filterValue) ||
        a.artist.toLowerCase().includes(filterValue)
      )
    } else if (this.rowDef === RowDef.artists) {
      this.dataSource.data = this.artists.filter(a =>
        a.name.toLowerCase().includes(filterValue)
      )
    }
  }

  sortChange(sortEvent): void {
    if (this.rowDef === RowDef.tracks) {
      this.sortTracks(sortEvent);
    } else if (this.rowDef === RowDef.playlists) {
      this.sortPlaylists(sortEvent);
    } else if (this.rowDef === RowDef.albums) {
      this.sortAlbums(sortEvent);
    } else if (this.rowDef === RowDef.artists) {
      this.sortArtists(sortEvent);
    }
  }

  audioEnded(): void {
    if (this.playableTracks.length > 0 && (this.playableIndex < this.playableTracks.length)) {
      this.playableIndex++;
      this.playTrack(this.playableTracks[this.playableIndex]);
    } else if (this.playableTracks.length > 0 && (this.playableIndex === this.playableTracks.length)) {
      if (!this.loop) {
        this.playableTracks = [];
      } else {
        this.playableIndex = 0;
        this.playTrack(this.playableTracks[this.playableIndex]);
      }
    } else if (this.playableTracks.length === 0 && this.loop) {
      this.playTrack(this.activeTrack);
    }
  }

  skip(): void {
    if (this.playableTracks && this.playableTracks.length !== 0) {
      this.playableIndex++;
      if (this.playableIndex < this.playableTracks.length) {
        this.playTrack(this.playableTracks[this.playableIndex]);
      } else if (this.loop) {
        this.playableIndex = 0;
        this.playTrack(this.playableTracks[this.playableIndex]);
      } else {
        this.playableIndex--;
      }
    }
  }

  back(): void {
    this.playableIndex--;
    if (this.playableIndex >= 0) {
      this.playTrack(this.playableTracks[this.playableIndex]);
    } else if (this.loop) {
      this.playableIndex = this.playableTracks.length - 1;
      this.playTrack(this.playableTracks[this.playableIndex]);
    } else {
      this.playableIndex++;
    }
  }

  toggleShuffle(): void {
    this.shuffle = !this.shuffle;
    if (this.shuffle) {
      this.playableTracks = this.playableTracks.filter(t => t.id !== this.activeTrack.id);
      this.playableTracks = MusicPlayerComponent.shuffleTracks(this.playableTracks);
      this.playableTracks = [this.activeTrack].concat(this.playableTracks);
      this.playableIndex = 0;
    }
  }

  toggleLoop(): void {
    this.loop = !this.loop;
  }

  static shuffleTracks(tracks: Track[]): Track[] {
    let currentIndex = tracks.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = tracks[currentIndex];
      tracks[currentIndex] = tracks[randomIndex];
      tracks[randomIndex] = temporaryValue;
    }

    return tracks;
  }

  static buildBodyFromTrack(track: UploadTrackRequest): string {
    let body = "";
    if (track.name !== null) {
      body = body.concat(`"name":"${track.name}"`)
    }
    if (track.artist !== null) {
      if (body !== "") {
        body = body.concat(",")
      }
      body = body.concat(`"artist":"${track.artist}"`)
    }
    if (track.album !== null) {
      if (body !== "") {
        body = body.concat(",")
      }
      body = body.concat(`"album":"${track.album}"`)
    }
    body = "{" + body + "}";
    return body;
  }
}
