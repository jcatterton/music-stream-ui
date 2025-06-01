import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicPlayerComponent } from './music-player.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  MockLoginService,
  MockMatDialog,
  MockPlaylistService,
  MockSnackBarService,
  MockTrackService
} from "../../mocks/services";
import { TrackService } from "../../services/track/track.service";
import { PlaylistService } from "../../services/playlist/playlist.service";
import { SnackBarPanelClass, SnackbarService } from "../../services/snackbar/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { of, throwError} from "rxjs";
import { MockTrack } from "../../mocks/tracks";
import { MockPlaylist } from "../../mocks/playlists";
import { MockAlbum } from "../../mocks/albums";
import { MockArtist } from "../../mocks/artists";
import { Title } from "@angular/platform-browser";
import { PlaylistInfoComponent } from "../playlist-info/playlist-info.component";
import { AlbumInfoComponent } from "../album-info/album-info.component";
import { ArtistInfoComponent } from "../artist-info/artist-info.component";
import { AddTrackComponent } from "../add-track/add-track.component";
import { Track, UploadTrackRequest, YoutubeRequest } from "../../models/track";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { RowDef } from "../../mocks/rowdef";
import { AddTrackFromYoutubeComponent } from "../add-track-from-youtube/add-track-from-youtube.component";
import { LoginService } from "../../services/login/login.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { SecurePipe } from "../../pipes/secure.pipe";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('MusicPlayerComponent', () => {
  let component: MusicPlayerComponent;
  let trackService: MockTrackService;
  let playlistService: MockPlaylistService;
  let snackBarService: MockSnackBarService;
  let fixture: ComponentFixture<MusicPlayerComponent>;
  let titleService: Title;
  let dialogService: MatDialog;
  let loginService: MockLoginService;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MusicPlayerComponent,
        SecurePipe
      ],
      providers: [
        { provide: TrackService, useClass: MockTrackService },
        { provide: PlaylistService, useClass: MockPlaylistService },
        { provide: SnackbarService, useClass: MockSnackBarService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: titleService, useClass: Title },
        { provide: LoginService, useClass: MockLoginService }
      ],
      imports: [
        RouterTestingModule.withRoutes([{ path: "**", component: class {} }]),
        HttpClientTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicPlayerComponent);
    component = fixture.componentInstance;
    trackService = TestBed.inject(TrackService);
    playlistService = TestBed.inject(PlaylistService);
    snackBarService = TestBed.inject(SnackbarService);
    titleService = TestBed.inject(Title);
    dialogService = TestBed.inject(MatDialog);
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should call loadTracks, set shuffle, set loop", () => {
      const loadTracksSpy = spyOn(component, "loadTracks");
      component.ngOnInit();
      expect(loadTracksSpy).toHaveBeenCalled();
      expect(component.shuffle).toBeFalsy();
      expect(component.loop).toBeFalsy();
    });
  });

  describe("loadTracks", () => {
    it("should call trackService getTracks", () => {
      const getTracksSpy = spyOn(trackService, "getTracks").and.callThrough();
      component.loadTracks();
      expect(getTracksSpy).toHaveBeenCalled();
    });

    it("should call loadPlaylists on getTracks success", () => {
      spyOn(trackService, "getTracks").and.callThrough();
      const loadPlaylistSpy = spyOn(component, "loadPlaylists");
      component.loadTracks();
      expect(loadPlaylistSpy).toHaveBeenCalled();
    });

    it("should call snackBarService showMessage on getTracks error", () => {
      spyOn(trackService, "getTracks").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.loadTracks();
      expect(snackBarSpy).toHaveBeenCalledWith("Error loading tracks", SnackBarPanelClass.fail);
    });
  });

  describe("loadPlaylists", () => {
    it("should call playlistService getPlaylists", () => {
      const getPlaylistsSpy = spyOn(playlistService, "getPlaylists").and.callThrough();
      component.loadPlaylists();
      expect(getPlaylistsSpy).toHaveBeenCalled();
    });

    it("should call loadAlbums on getTracks success", () => {
      spyOn(playlistService, "getPlaylists").and.callThrough();
      const loadAlbumsSpy = spyOn(component, "loadAlbums");
      component.loadPlaylists();
      expect(loadAlbumsSpy).toHaveBeenCalled();
    });

    it("should call snackBarService showMessage on getPlaylists error", () => {
      spyOn(playlistService, "getPlaylists").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.loadPlaylists();
      expect(snackBarSpy).toHaveBeenCalledWith("Error loading playlists", SnackBarPanelClass.fail);
    });
  });

  describe("loadAlbums", () => {
    it("should add new album to album list if track's album is not in list", () => {
      component.albums = [];
      component.tracks = [MockTrack.mockTrack1];
      component.loadAlbums();
      expect(component.albums.length).toEqual(1);
      expect(JSON.stringify(component.albums[0].tracks[0])).toEqual(JSON.stringify(MockTrack.mockTrack1));
    });

    it("should append track to album's tracklist if track's album already exists", () => {
      component.albums = MockAlbum.mockAlbums;
      component.tracks = [
        { id: "test", name: "test", album: MockAlbum.mockAlbum1.name, artist: "test", audioFile: "" },
        { id: "test", name: "test", album: MockAlbum.mockAlbum2.name, artist: "test", audioFile: "" },
        { id: "test", name: "test", album: MockAlbum.mockAlbum3.name, artist: "test", audioFile: "" },
        { id: "test", name: "test", album: MockAlbum.mockAlbum1.name, artist: "test", audioFile: "" }
      ];
      component.loadAlbums();
      expect(component.albums.length).toEqual(MockAlbum.mockAlbums.length);
      expect(component.albums.some(a => a.tracks.some(t => JSON.stringify(t) === JSON.stringify({ id: "test", name: "test", album: MockAlbum.mockAlbum1.name, artist: "test", audioFile: "" })))).toBeTruthy();
    });
  });

  describe("loadArtists", () => {
    it("should add new artist to artist list if album's artist is not in list", () => {
      component.artists = [];
      component.albums = [MockAlbum.mockAlbum1];
      component.loadArtists();
      expect(component.artists.length).toEqual(1);
      expect(JSON.stringify(component.artists[0].albums[0])).toEqual(JSON.stringify(MockAlbum.mockAlbum1));
    });

    it("should append album to artist's albums if album's artist already exists", () => {
      component.artists = MockArtist.mockArtists;
      component.albums = [
        { name: "test", artist: MockArtist.mockArtist1.name, tracks: [] },
        { name: "test", artist: MockArtist.mockArtist2.name, tracks: [] },
        { name: "test", artist: MockArtist.mockArtist3.name, tracks: [] },
        { name: "test", artist: MockArtist.mockArtist1.name, tracks: [] }
      ];
      component.loadArtists();
      expect(component.artists.length).toEqual(MockArtist.mockArtists.length);
      expect(component.artists.some(a => a.albums.some(t => JSON.stringify(t) === JSON.stringify({ name: "test", artist: MockArtist.mockArtist1.name, tracks: [] })))).toBeTruthy();
    });

    it("should call setRowDef if firstLoad", () => {
      const setRowDefSpy = spyOn(component, "setRowDef");
      component.firstLoad = true;
      component.loadArtists();
      expect(setRowDefSpy).toHaveBeenCalledWith("tracks");
    });

    it("should call refreshDataSource if not firstLoad", () => {
      const refreshSpy = spyOn(component, "refreshDataSource");
      component.firstLoad = false;
      component.loadArtists();
      expect(refreshSpy).toHaveBeenCalled();
    });
  });

  describe("handleClick", () => {
    it("should call playTrack if rowDef is 'tracks'", () => {
      component.rowDef = RowDef.tracks;
      const playTrackSpy = spyOn(component, "playTrack");
      component.handleClick(MockTrack.mockTrack1);
      expect(playTrackSpy).toHaveBeenCalledWith(MockTrack.mockTrack1);
    });

    it("should call openPlaylistInfo if rowDef is 'playlists'", () => {
      component.rowDef = RowDef.playlists;
      const openPlaylistInfoSpy = spyOn(component, "openPlaylistInfo");
      component.handleClick(MockPlaylist.mockPlaylist1);
      expect(openPlaylistInfoSpy).toHaveBeenCalledWith(MockPlaylist.mockPlaylist1);
    });

    it("should call openAlbumInfo if rowDef is albums", () => {
      component.rowDef = RowDef.albums;
      const openAlbumInfoSpy = spyOn(component, "openAlbumInfo");
      component.handleClick(MockAlbum.mockAlbum1);
      expect(openAlbumInfoSpy).toHaveBeenCalledWith(MockAlbum.mockAlbum1);
    });

    it("should call openArtistInfo if rowDef is artists", () => {
      component.rowDef = RowDef.artists;
      const openArtistInfo = spyOn(component, "openArtistInfo");
      component.handleClick(MockArtist.mockArtist1);
      expect(openArtistInfo).toHaveBeenCalledWith(MockArtist.mockArtist1);
    });

    it("should do nothing if rowDef does not match any supported values", () => {
      component.rowDef = "test";
      component.handleClick(null);
    });
  });

  describe("playTrack", () => {
    it("should call player load, player play, set active track, and set title", () => {
      const loadSpy = spyOn(component.$player, "load");
      const playSpy = spyOn(component.$player, "play");
      const titleSpy = spyOn(titleService, "setTitle");
      component.playTrack(MockTrack.mockTrack1);
      expect(loadSpy).toHaveBeenCalled();
      expect(playSpy).toHaveBeenCalled();
      expect(component.activeTrack).toEqual(MockTrack.mockTrack1);
      expect(titleSpy).toHaveBeenCalledWith(`${component.activeTrack.name} - ${component.activeTrack.artist}`);
    });
  });

  describe("playAll", () => {
    it("should call playTrack if shuffle is true", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.shuffle = true;
      const playTrackSpy = spyOn(component, "playTrack");
      component.playAll();
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[0]);
    });

    it("should call playTrack if shuffle is false", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.shuffle = false;
      const playTrackSpy = spyOn(component, "playTrack");
      component.playAll();
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[0]);
    });
  });

  describe("openPlaylistInfo", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const dialogSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.openPlaylistInfo(MockPlaylist.mockPlaylist1);
      expect(dialogSpy).toHaveBeenCalledWith(PlaylistInfoComponent, { width: "700px", disableClose: false });
    });

    it("should set playableTracks to array of tracks and call playTrack on truthy response and multiple track output", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ output: MockTrack.mockTracks, type: "multiple" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const playTrackSpy = spyOn(component, "playTrack");
      component.shuffle = true;
      component.openPlaylistInfo(MockPlaylist.mockPlaylist1);
      expect(component.playableTracks).not.toEqual([]);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[0]);
    });

    it("should call playTrack if output type is single", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ output: MockTrack.mockTrack1, type: "single" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const playTrackSpy = spyOn(component, "playTrack");
      component.shuffle = true;
      component.openPlaylistInfo(MockPlaylist.mockPlaylist1);
      expect(component.playableTracks).toEqual([]);
      expect(playTrackSpy).toHaveBeenCalledWith(MockTrack.mockTrack1);
    });

    it("should call loadPlaylists if output is falsy", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(null),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const loadPlaylistsSpy = spyOn(component, "loadPlaylists");
      component.openPlaylistInfo(MockPlaylist.mockPlaylist1);
      expect(loadPlaylistsSpy).toHaveBeenCalled();
    });
  });

  describe("openAlbumInfo", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const dialogSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.openAlbumInfo(MockAlbum.mockAlbum1);
      expect(dialogSpy).toHaveBeenCalledWith(AlbumInfoComponent, { width: "700px", disableClose: false });
    });

    it("should set playableTracks to array of tracks and call playTrack on truthy response and multiple track output", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ output: MockTrack.mockTracks, type: "multiple" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const playTrackSpy = spyOn(component, "playTrack");
      component.shuffle = true;
      component.openAlbumInfo(MockAlbum.mockAlbum1);
      expect(component.playableTracks).not.toEqual([]);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[0]);
    });

    it("should call playTrack if output type is single", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ output: MockTrack.mockTrack1, type: "single" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const playTrackSpy = spyOn(component, "playTrack");
      component.shuffle = true;
      component.openAlbumInfo(MockAlbum.mockAlbum1);
      expect(component.playableTracks).toEqual([]);
      expect(playTrackSpy).toHaveBeenCalledWith(MockTrack.mockTrack1);
    });

    it("should call openArtistInfo if output type is artist", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ output: MockArtist.mockArtist1, type: "artist" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const openArtistInfoSpy = spyOn(component, "openArtistInfo");
      component.openAlbumInfo(MockAlbum.mockAlbum1);
      expect(openArtistInfoSpy).toHaveBeenCalled();
    });
  });

  describe("openArtistInfo", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const dialogSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.openArtistInfo(MockArtist.mockArtist1);
      expect(dialogSpy).toHaveBeenCalledWith(ArtistInfoComponent, { width: "700px", disableClose: false });
    });

    it("should set playableTracks to array of tracks and call playTrack on truthy response and tracks output", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ output: MockTrack.mockTracks, type: "tracks" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const playTrackSpy = spyOn(component, "playTrack");
      component.shuffle = true;
      component.openArtistInfo(MockArtist.mockArtist1);
      expect(component.playableTracks).not.toEqual([]);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[0]);
    });

    it("should call openAlbumInfo if output type is album", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ output: MockAlbum.mockAlbum1, type: "album" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const albumInfoSpy = spyOn(component, "openAlbumInfo");
      component.openArtistInfo(MockArtist.mockArtist1);
      expect(albumInfoSpy).toHaveBeenCalledWith(MockAlbum.mockAlbum1);
    });
  });

  describe("addTrack", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const dialogSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.addTrack();
      expect(dialogSpy).toHaveBeenCalledWith(AddTrackComponent, { width: "700px", disableClose: false });
    });

    it("should call dialogService open if adding duplicate trap", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, audioFile: null } as UploadTrackRequest),
        componentInstance: {}
      });
      const confirmationDialog = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      component.tracks = MockTrack.mockTracks;
      const dialogSpy = spyOn(dialogService, "open").and.returnValues(dialogRef, confirmationDialog);
      component.addTrack();
      expect(dialogSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, { width: "700px", disableClose: false })
    });

    it("should call trackService uploadTrack if duplicate track response is truthy", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, audioFile: null } as UploadTrackRequest),
        componentInstance: {}
      });
      const confirmationDialog = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      component.tracks = MockTrack.mockTracks;
      spyOn(dialogService, "open").and.returnValues(dialogRef, confirmationDialog);
      const uploadTrackSpy = spyOn(trackService, "uploadTrack").and.callThrough();
      const fd = new FormData();
      fd.set("input", null);
      fd.set("body", MusicPlayerComponent.buildBodyFromTrack({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, audioFile: null } as UploadTrackRequest));
      component.addTrack();
      expect(uploadTrackSpy).toHaveBeenCalledWith(fd)
    });

    it("should call snackBarService if uploadTrack errors after duplicate track response is truthy", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, audioFile: null } as UploadTrackRequest),
        componentInstance: {}
      });
      const confirmationDialog = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      component.tracks = MockTrack.mockTracks;
      spyOn(dialogService, "open").and.returnValues(dialogRef, confirmationDialog);
      spyOn(trackService, "uploadTrack").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.addTrack();
      expect(snackBarSpy).toHaveBeenCalledWith("Error adding tracks", SnackBarPanelClass.fail);
    });

    it("should call trackService uploadTrack if no duplicate", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, audioFile: null } as UploadTrackRequest),
        componentInstance: {}
      });
      component.tracks = [];
      spyOn(dialogService, "open").and.returnValues(dialogRef);
      const uploadTrackSpy = spyOn(trackService, "uploadTrack").and.callThrough();
      const fd = new FormData();
      fd.set("input", null);
      fd.set("body", MusicPlayerComponent.buildBodyFromTrack({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, audioFile: null } as UploadTrackRequest));
      component.addTrack();
      expect(uploadTrackSpy).toHaveBeenCalledWith(fd)
    });

    it("should call snackBarService showMessage if uploadTrack errors on no duplicate", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, audioFile: null } as UploadTrackRequest),
        componentInstance: {}
      });
      component.tracks = [];
      spyOn(dialogService, "open").and.returnValues(dialogRef);
      spyOn(trackService, "uploadTrack").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.addTrack();
      expect(snackBarSpy).toHaveBeenCalledWith("Error adding tracks", SnackBarPanelClass.fail);
    });
  });

  describe("addTrackFromYoutube", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const dialogSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.addTrackFromYoutube();
      expect(dialogSpy).toHaveBeenCalledWith(AddTrackFromYoutubeComponent, { width: "700px", disableClose: false });
    });

    it("should call dialogService open if adding duplicate trap", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, youtubeLink: "test" } as YoutubeRequest),
        componentInstance: {}
      });
      const confirmationDialog = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      component.tracks = MockTrack.mockTracks;
      const dialogSpy = spyOn(dialogService, "open").and.returnValues(dialogRef, confirmationDialog);
      component.addTrackFromYoutube();
      expect(dialogSpy).toHaveBeenCalled();
      expect(dialogSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, { width: "700px", disableClose: false })
    });

    it("should call trackService uploadTrackFromYoutube if duplicate track response is truthy", () => {
      const ytRequest = { name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, youtubeLink: "test" };
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(ytRequest),
        componentInstance: {}
      });
      const confirmationDialog = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      component.tracks = MockTrack.mockTracks;
      spyOn(dialogService, "open").and.returnValues(dialogRef, confirmationDialog);
      const uploadTrackSpy = spyOn(trackService, "uploadTrackFromYoutube").and.callThrough();
      component.addTrackFromYoutube();
      expect(uploadTrackSpy).toHaveBeenCalledWith(ytRequest)
    });

    it("should call snackBarService if uploadTrackFromYoutube errors after duplicate track response is truthy", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, youtubeLink: "test" } as YoutubeRequest),
        componentInstance: {}
      });
      const confirmationDialog = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      component.tracks = MockTrack.mockTracks;
      spyOn(dialogService, "open").and.returnValues(dialogRef, confirmationDialog);
      spyOn(trackService, "uploadTrackFromYoutube").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.addTrackFromYoutube();
      expect(snackBarSpy).toHaveBeenCalledWith("Error adding tracks", SnackBarPanelClass.fail);
    });

    it("should call trackService uploadTrack if no duplicate", () => {
      const ytRequest = { name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, youtubeLink: "test" };
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(ytRequest),
        componentInstance: {}
      });
      component.tracks = [];
      spyOn(dialogService, "open").and.returnValues(dialogRef);
      const uploadTrackSpy = spyOn(trackService, "uploadTrackFromYoutube").and.callThrough();
      component.addTrackFromYoutube();
      expect(uploadTrackSpy).toHaveBeenCalledWith(ytRequest)
    });

    it("should call snackBarService showMessage if uploadTrack errors on no duplicate", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: MockTrack.mockTrack1.name, album: MockTrack.mockTrack1.album, artist: MockTrack.mockTrack1.artist, youtubeLink: "test" } as YoutubeRequest),
        componentInstance: {}
      });
      component.tracks = [];
      spyOn(dialogService, "open").and.returnValues(dialogRef);
      spyOn(trackService, "uploadTrackFromYoutube").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.addTrackFromYoutube();
      expect(snackBarSpy).toHaveBeenCalledWith("Error adding tracks", SnackBarPanelClass.fail);
    });
  });

  describe("delete", () => {
    it("should call deleteTrack if rowDef is 'tracks'", () => {
      component.rowDef = RowDef.tracks;
      const deleteTrackSpy = spyOn(component, "deleteTrack");
      component.delete(MockTrack.mockTrack1);
      expect(deleteTrackSpy).toHaveBeenCalledWith(MockTrack.mockTrack1);
    });

    it("should call deletePlaylist if rowDef is 'playlists'", () => {
      component.rowDef = RowDef.playlists;
      const deletePlaylistSpy = spyOn(component, "deletePlaylist");
      component.delete(MockPlaylist.mockPlaylist1);
      expect(deletePlaylistSpy).toHaveBeenCalledWith(MockPlaylist.mockPlaylist1);
    });
  });

  describe("deleteTrack", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const openSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.deleteTrack(MockTrack.mockTrack1);
      expect(openSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, { width: "400px", disableClose: true });
    });

    it("should call trackService deleteTrack if confirmation response is truthy", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const deleteTrackSpy = spyOn(trackService, "deleteTrack").and.callThrough();
      component.deleteTrack(MockTrack.mockTrack1);
      expect(deleteTrackSpy).toHaveBeenCalledWith(MockTrack.mockTrack1.id);
    });

    it("should call loadTracks if delete is successful", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(trackService, "deleteTrack").and.callThrough();
      const loadTracksSpy = spyOn(component, "loadTracks");
      component.deleteTrack(MockTrack.mockTrack1);
      expect(loadTracksSpy).toHaveBeenCalled();
    });

    it("should call snackBarService showMessage if delete errors", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(trackService, "deleteTrack").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.deleteTrack(MockTrack.mockTrack1);
      expect(snackBarSpy).toHaveBeenCalledWith("Error deleting track", SnackBarPanelClass.fail);
    });
  });

  describe("deletePlaylist", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const openSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.deletePlaylist(MockPlaylist.mockPlaylist1);
      expect(openSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, { width: "400px", disableClose: true });
    });

    it("should call trackService deleteTrack if confirmation response is truthy", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const deletePlaylistSpy = spyOn(playlistService, "deletePlaylist").and.callThrough();
      component.deletePlaylist(MockPlaylist.mockPlaylist1);
      expect(deletePlaylistSpy).toHaveBeenCalledWith(MockPlaylist.mockPlaylist1.id);
    });

    it("should call loadTracks if delete is successful", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "deletePlaylist").and.callThrough();
      const loadTracksSpy = spyOn(component, "loadTracks");
      component.deletePlaylist(MockPlaylist.mockPlaylist1);
      expect(loadTracksSpy).toHaveBeenCalled();
    });

    it("should call snackBarService showMessage if delete errors", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "deletePlaylist").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.deletePlaylist(MockPlaylist.mockPlaylist1);
      expect(snackBarSpy).toHaveBeenCalledWith("Error deleting playlist", SnackBarPanelClass.fail);
    });
  });

  describe("addPlaylist", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const openSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.addPlaylist();
      expect(openSpy).toHaveBeenCalled();
    });

    it("should call snackBarService if attempting to add playlist with duplicated name", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(MockPlaylist.mockPlaylist1.name),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.playlists = MockPlaylist.mockPlaylists;
      component.addPlaylist();
      expect(snackBarSpy).toHaveBeenCalledWith("Playlist with that name already exists", SnackBarPanelClass.fail);
    });

    it("should call playlistService createPlaylist", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of("test"),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const createPlaylistSpy = spyOn(playlistService, "createPlaylist").and.callThrough();
      component.addPlaylist();
      expect(createPlaylistSpy).toHaveBeenCalledWith("test");
    });

    it("should call snackBarService showMessage on createPlaylist error", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of("test"),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "createPlaylist").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.addPlaylist();
      expect(snackBarSpy).toHaveBeenCalledWith("Error adding playlist", SnackBarPanelClass.fail);
    });
  });

  describe("addTrackToPlaylist", () => {
    it("should call snackBarService showMessage if no playlists exists", () => {
      component.playlists = [];
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.addTrackToPlaylist(MockTrack.mockTrack1);
      expect(snackBarSpy).toHaveBeenCalledWith("No playlists exist", SnackBarPanelClass.fail);
    });

    it("should open dialog", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const openSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.playlists = JSON.parse(JSON.stringify(MockPlaylist.mockPlaylists));
      component.addTrackToPlaylist(MockTrack.mockTrack1);
      expect(openSpy).toHaveBeenCalled();
    });

    it("should call snackBarService if track already exists in playlist", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(MockPlaylist.mockPlaylist1.id),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.playlists = MockPlaylist.mockPlaylists;
      component.addTrackToPlaylist(MockTrack.mockTrack1);
      expect(snackBarSpy).toHaveBeenCalledWith("Track already exists in playlist", SnackBarPanelClass.fail);
    });

    it("should call playlistService addTrackToPlaylist", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(MockPlaylist.mockPlaylist1.id),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const addTrackToPlaylistSpy = spyOn(playlistService, "addTrackToPlaylist").and.callThrough();
      component.playlists = MockPlaylist.mockPlaylists;
      component.addTrackToPlaylist({ id: "test", name: "test", artist: "test", album: "test", audioFile: "test" });
      expect(addTrackToPlaylistSpy).toHaveBeenCalledWith(MockPlaylist.mockPlaylist1.id, "test");
    });

    it("should call snackBarService showMessage if addTrackToPlaylist errors", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(MockPlaylist.mockPlaylist1.id),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "addTrackToPlaylist").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.playlists = MockPlaylist.mockPlaylists;
      component.addTrackToPlaylist({ id: "test", name: "test", artist: "test", album: "test", audioFile: "test" });
      expect(snackBarSpy).toHaveBeenCalledWith("Error adding track to playlist", SnackBarPanelClass.fail);
    });
  });

  describe("updateTrack", () => {
    it("should open dialog", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const openSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.updateTrack(MockTrack.mockTrack1);
      expect(openSpy).toHaveBeenCalled();
    });

    it("should call trackService updateTrack on update response", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: "test", album: "test", artist: "test" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const updateSpy = spyOn(trackService, "updateTrack").and.callThrough();
      component.updateTrack(MockTrack.mockTrack1);
      expect(updateSpy).toHaveBeenCalledWith(MockTrack.mockTrack1.id, { name: "test", album: "test", artist: "test" } as Track);
    });

    it("should call snackBarService and loadTracks on update success", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: "test", album: "test", artist: "test" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(trackService, "updateTrack").and.callThrough();
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      const loadTracksSpy = spyOn(component, "loadTracks");
      component.updateTrack(MockTrack.mockTrack1);
      expect(snackBarSpy).toHaveBeenCalledWith("Track updated successfully", SnackBarPanelClass.success);
      expect(loadTracksSpy).toHaveBeenCalled();
    });

    it("should call snackBarService showMessage on update error", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of({ name: "test", album: "test", artist: "test" }),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(trackService, "updateTrack").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.updateTrack(MockTrack.mockTrack1);
      expect(snackBarSpy).toHaveBeenCalledWith("Error updating track", SnackBarPanelClass.fail);
    });
  });

  describe("sortArtists", () => {
    beforeEach(() => {
      component.artists = MockArtist.mockArtists;
      component.dataSource.data = component.artists;
    });

    it("should sort alphabetically if sortDirection is ''", () => {
      component.sortArtists({ active: "", direction: "" });
      expect(component.dataSource.data[0].name).toEqual("testArtist1");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist3");
    });

    it("should sort alphabetically if sortActive is 'name' and sortDirection is 'asc'", () => {
      component.sortArtists({ active: "name", direction: "asc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist1");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist3");
    });

    it("should sort reverse alphabetically if sortActive is 'name' and sortDirection is 'desc'", () => {
      component.sortArtists({ active: "name", direction: "desc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist3");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist1");
    });

    it("should sort by album count if sortActive is 'album' and sortDirection is 'asc'", () => {
      component.sortArtists({ active: "albums", direction: "asc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist3");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist1");
    });

    it("should sort by album count if sortActive is 'album' and sortDirection is 'asc', initial order reversed", () => {
      component.artists = [MockArtist.mockArtist3, MockArtist.mockArtist2, MockArtist.mockArtist1];
      component.dataSource.data = component.artists;
      component.sortArtists({ active: "albums", direction: "asc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist3");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist1");
    });

    it("should sort by album count if sortActive is 'album' and sortDirection is 'asc', two artists with same count", () => {
      component.artists = [MockArtist.mockArtist2, MockArtist.mockArtist2, MockArtist.mockArtist1];
      component.dataSource.data = component.artists;
      component.sortArtists({ active: "albums", direction: "asc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist2");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist1");
    });

    it("should sort by reverse album count if sortActive is 'album' and sortDirection is 'desc'", () => {
      component.sortArtists({ active: "albums", direction: "desc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist1");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist3");
    });

    it("should sort by reverse album count if sortActive is 'album' and sortDirection is 'desc', initial order reversed", () => {
      component.artists = [MockArtist.mockArtist3, MockArtist.mockArtist2, MockArtist.mockArtist1];
      component.dataSource.data = component.artists;
      component.sortArtists({ active: "albums", direction: "desc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist1");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist3");
    });

    it("should sort by album count if sortActive is 'album' and sortDirection is 'desc', two artists with same count", () => {
      component.artists = [MockArtist.mockArtist2, MockArtist.mockArtist2, MockArtist.mockArtist1];
      component.dataSource.data = component.artists;
      component.sortArtists({ active: "albums", direction: "desc" });
      expect(component.dataSource.data[0].name).toEqual("testArtist1");
      expect(component.dataSource.data[1].name).toEqual("testArtist2");
      expect(component.dataSource.data[2].name).toEqual("testArtist2");
    });
  });

  describe("sortAlbums", () => {
    beforeEach(() => {
      component.albums = MockAlbum.mockAlbums;
      component.dataSource.data = component.albums;
    });

    it("should sort alphabetically if sortEvent direction is ''", () => {
      component.sortAlbums({ active: "", direction: "" });
      expect(component.albums[0].name).toEqual("testAlbum1");
      expect(component.albums[1].name).toEqual("testAlbum2");
      expect(component.albums[2].name).toEqual("testAlbum3");
    });

    it("should sort alphabetically if sortEvent active is 'name' and direction is 'asc'", () => {
      component.sortAlbums({ active: "name", direction: "asc" });
      expect(component.albums[0].name).toEqual("testAlbum1");
      expect(component.albums[1].name).toEqual("testAlbum2");
      expect(component.albums[2].name).toEqual("testAlbum3");
    });

    it("should sort reverse alphabetically if sortEvent active is 'name' and direction is 'desc'", () => {
      component.sortAlbums({ active: "name", direction: "desc" });
      expect(component.albums[0].name).toEqual("testAlbum3");
      expect(component.albums[1].name).toEqual("testAlbum2");
      expect(component.albums[2].name).toEqual("testAlbum1");
    });

    it("should sort alphabetically by artist if sortEvent active is 'name' and direction is 'asc'", () => {
      component.sortAlbums({ active: "artist", direction: "asc" });
      expect(component.albums[0].artist).toEqual("testArtist1");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist3");
    });

    it("should sort reverse alphabetically by artist if sortEvent active is 'name' and direction is 'desc'", () => {
      component.sortAlbums({ active: "artist", direction: "desc" });
      expect(component.albums[0].artist).toEqual("testArtist3");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist1");
    });

    it("should sort by track count if sortEvent active is 'tracks' and direction is 'asc'", () => {
      component.sortAlbums({ active: "tracks", direction: "asc" });
      expect(component.albums[0].artist).toEqual("testArtist3");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist1");
    });

    it("should sort by track count if sortEvent active is 'tracks' and direction is 'asc', reversed original order", () => {
      component.albums = [MockAlbum.mockAlbum3, MockAlbum.mockAlbum2, MockAlbum.mockAlbum1];
      component.dataSource.data = component.albums;
      component.sortAlbums({ active: "tracks", direction: "asc" });
      expect(component.albums[0].artist).toEqual("testArtist3");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist1");
    });

    it("should sort by track count if sortEvent active is 'tracks' and direction is 'asc', duplicate albums", () => {
      component.albums = [MockAlbum.mockAlbum2, MockAlbum.mockAlbum2, MockAlbum.mockAlbum1];
      component.dataSource.data = component.albums;
      component.sortAlbums({ active: "tracks", direction: "asc" });
      expect(component.albums[0].artist).toEqual("testArtist2");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist1");
    });

    it("should sort by reverse track count if sortEvent active is 'tracks' and direction is 'desc'", () => {
      component.sortAlbums({ active: "tracks", direction: "desc" });
      expect(component.albums[0].artist).toEqual("testArtist1");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist3");
    });

    it("should sort by reverse track count if sortEvent active is 'tracks' and direction is 'desc', reverse original order", () => {
      component.albums = [MockAlbum.mockAlbum3, MockAlbum.mockAlbum2, MockAlbum.mockAlbum1];
      component.dataSource.data = component.albums;
      component.sortAlbums({ active: "tracks", direction: "desc" });
      expect(component.albums[0].artist).toEqual("testArtist1");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist3");
    });

    it("should sort by reverse track count if sortEvent active is 'tracks' and direction is 'desc', duplicate albums", () => {
      component.albums = [MockAlbum.mockAlbum2, MockAlbum.mockAlbum2, MockAlbum.mockAlbum1];
      component.dataSource.data = component.albums;
      component.sortAlbums({ active: "tracks", direction: "desc" });
      expect(component.albums[0].artist).toEqual("testArtist1");
      expect(component.albums[1].artist).toEqual("testArtist2");
      expect(component.albums[2].artist).toEqual("testArtist2");
    });
  });

  describe("sortPlaylists", () => {
    beforeEach(() => {
      component.playlists = MockPlaylist.mockPlaylists;
      component.dataSource.data = component.playlists;
    });

    it("should sort alphabetically if sortEvent direction is ''", () => {
      component.sortPlaylists({ active: "", direction: "" });
      expect(component.playlists[0].name).toEqual("testName1");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName3");
    });

    it("should sort alphabetically if sortEvent active is 'name' and direction is 'asc'", () => {
      component.sortPlaylists({ active: "name", direction: "asc" });
      expect(component.playlists[0].name).toEqual("testName1");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName3");
    });

    it("should sort alphabetically if sortEvent active is 'name' and direction is 'desc'", () => {
      component.sortPlaylists({ active: "name", direction: "desc" });
      expect(component.playlists[0].name).toEqual("testName3");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName1");
    });

    it("should sort by track count if sortEvent active is 'tracks' and direction is 'asc'", () => {
      component.sortPlaylists({ active: "tracks", direction: "asc" });
      expect(component.playlists[0].name).toEqual("testName1");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName3");
    });

    it("should sort by track count if sortEvent active is 'tracks' and direction is 'asc', reversed original order", () => {
      component.playlists = [MockPlaylist.mockPlaylist3, MockPlaylist.mockPlaylist2, MockPlaylist.mockPlaylist1];
      component.dataSource.data = component.playlists;
      component.sortPlaylists({ active: "tracks", direction: "asc" });
      expect(component.playlists[0].name).toEqual("testName1");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName3");
    });

    it("should sort by track count if sortEvent active is 'tracks' and direction is 'asc', duplicate albums", () => {
      component.playlists = [MockPlaylist.mockPlaylist2, MockPlaylist.mockPlaylist2, MockPlaylist.mockPlaylist1];
      component.dataSource.data = component.playlists;
      component.sortPlaylists({ active: "tracks", direction: "asc" });
      expect(component.playlists[0].name).toEqual("testName1");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName2");
    });

    it("should sort by reverse track count if sortEvent active is 'tracks' and direction is 'desc'", () => {
      component.sortPlaylists({ active: "tracks", direction: "desc" });
      expect(component.playlists[0].name).toEqual("testName3");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName1");
    });

    it("should sort by reverse track count if sortEvent active is 'tracks' and direction is 'desc', reverse original order", () => {
      component.playlists = [MockPlaylist.mockPlaylist3, MockPlaylist.mockPlaylist2, MockPlaylist.mockPlaylist1];
      component.dataSource.data = component.playlists;
      component.sortPlaylists({ active: "tracks", direction: "desc" });
      expect(component.playlists[0].name).toEqual("testName3");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName1");
    });

    it("should sort by reverse track count if sortEvent active is 'tracks' and direction is 'desc', duplicate albums", () => {
      component.playlists = [MockPlaylist.mockPlaylist2, MockPlaylist.mockPlaylist2, MockPlaylist.mockPlaylist1];
      component.dataSource.data = component.playlists;
      component.sortPlaylists({ active: "tracks", direction: "desc" });
      expect(component.playlists[0].name).toEqual("testName2");
      expect(component.playlists[1].name).toEqual("testName2");
      expect(component.playlists[2].name).toEqual("testName1");
    });
  });

  describe("sortTracks", () => {
    it("should prioritize sort as artist > album > name", () => {
      component.tracks = [
        { id: "test", name: "testTrack1", artist: "testArtist1", album: "testAlbum1", audioFile: "testFile" },
        { id: "test", name: "testTrack2", artist: "testArtist2", album: "testAlbum2", audioFile: "testFile" },
        { id: "test", name: "testTrack3", artist: "testArtist0", album: "testAlbum3", audioFile: "testFile" },
        { id: "test", name: "testTrack3", artist: "testArtist0", album: "testAlbum1", audioFile: "testFile" },
        { id: "test", name: "testTrack3", artist: "testArtist0", album: "testAlbum2", audioFile: "testFile" },
      ];
      component.dataSource.data = component.tracks;
      component.sortTracks({ active: "", direction: "" });
      expect(JSON.stringify(component.tracks[0])).toEqual(JSON.stringify({ id: "test", name: "testTrack3", artist: "testArtist0", album: "testAlbum1", audioFile: "testFile" }));
      expect(JSON.stringify(component.tracks[1])).toEqual(JSON.stringify({ id: "test", name: "testTrack3", artist: "testArtist0", album: "testAlbum2", audioFile: "testFile" }));
      expect(JSON.stringify(component.tracks[2])).toEqual(JSON.stringify({ id: "test", name: "testTrack3", artist: "testArtist0", album: "testAlbum3", audioFile: "testFile" }));
      expect(JSON.stringify(component.tracks[3])).toEqual(JSON.stringify({ id: "test", name: "testTrack1", artist: "testArtist1", album: "testAlbum1", audioFile: "testFile" }));
      expect(JSON.stringify(component.tracks[4])).toEqual(JSON.stringify({ id: "test", name: "testTrack2", artist: "testArtist2", album: "testAlbum2", audioFile: "testFile" }));
    });

    it("should sort alphabetically if sortEvent active is 'name' and direction is 'asc'", () => {
      component.tracks = MockTrack.mockTracks;
      component.dataSource.data = component.tracks;
      component.sortTracks({ active: "name", direction: "asc" });
      expect(component.tracks[0].name).toEqual("testName1");
      expect(component.tracks[1].name).toEqual("testName2");
      expect(component.tracks[2].name).toEqual("testName3");
    });

    it("should sort reverse alphabetically if sortEvent active is 'name' and direction is 'desc'", () => {
      component.tracks = MockTrack.mockTracks;
      component.dataSource.data = component.tracks;
      component.sortTracks({ active: "name", direction: "desc" });
      expect(component.tracks[0].name).toEqual("testName3");
      expect(component.tracks[1].name).toEqual("testName2");
      expect(component.tracks[2].name).toEqual("testName1");
    });

    it("should sort alphabetically by artist if sortEvent active is 'artist' and direction is 'asc'", () => {
      component.tracks = MockTrack.mockTracks;
      component.dataSource.data = component.tracks;
      component.sortTracks({ active: "artist", direction: "asc" });
      expect(component.tracks[0].name).toEqual("testName1");
      expect(component.tracks[1].name).toEqual("testName2");
      expect(component.tracks[2].name).toEqual("testName3");
    });

    it("should sort reverse alphabetically by artist if sortEvent active is 'artist' and direction is 'desc'", () => {
      component.tracks = MockTrack.mockTracks;
      component.dataSource.data = component.tracks;
      component.sortTracks({ active: "artist", direction: "desc" });
      expect(component.tracks[0].name).toEqual("testName3");
      expect(component.tracks[1].name).toEqual("testName2");
      expect(component.tracks[2].name).toEqual("testName1");
    });

    it("should sort alphabetically by album if sortEvent active is 'album' and direction is 'asc'", () => {
      component.tracks = MockTrack.mockTracks;
      component.dataSource.data = component.tracks;
      component.sortTracks({ active: "album", direction: "asc" });
      expect(component.tracks[0].name).toEqual("testName1");
      expect(component.tracks[1].name).toEqual("testName2");
      expect(component.tracks[2].name).toEqual("testName3");
    });

    it("should sort reverse alphabetically by album if sortEvent active is 'album' and direction is 'desc'", () => {
      component.tracks = MockTrack.mockTracks;
      component.dataSource.data = component.tracks;
      component.sortTracks({ active: "album", direction: "desc" });
      expect(component.tracks[0].name).toEqual("testName3");
      expect(component.tracks[1].name).toEqual("testName2");
      expect(component.tracks[2].name).toEqual("testName1");
    });
  });

  describe("refreshDataSource", () => {
    it("should set dataSource data to tracks if rowDef is tracks", () => {
      component.tracks = MockTrack.mockTracks;
      component.rowDef = RowDef.tracks;
      component.refreshDataSource();
      expect(JSON.stringify(component.tracks)).toEqual(JSON.stringify(component.dataSource.data));
    });

    it("should set dataSource data to playlists if rowDef is playlists", () => {
      component.playlists = MockPlaylist.mockPlaylists;
      component.rowDef = RowDef.playlists;
      component.refreshDataSource();
      expect(JSON.stringify(component.playlists)).toEqual(JSON.stringify(component.dataSource.data));
    });

    it("should set dataSource data to albums if rowDef is albums", () => {
      component.albums = MockAlbum.mockAlbums;
      component.rowDef = RowDef.albums;
      component.refreshDataSource();
      expect(JSON.stringify(component.albums)).toEqual(JSON.stringify(component.dataSource.data));
    });

    it("should set dataSource data to artists if rowDef is artists", () => {
      component.artists = MockArtist.mockArtists;
      component.rowDef = RowDef.artists;
      component.refreshDataSource();
      expect(JSON.stringify(component.artists)).toEqual(JSON.stringify(component.dataSource.data));
    });
  });

  describe("setRowDef", () => {
    it("should do nothing if rowDef is already set as given def", () => {
      component.rowDef = "test";
      component.setRowDef("test");
      expect(component.rowDef).toEqual("test");
    });

    it("should call refreshDataSource", () => {
      const refreshSpy = spyOn(component, "refreshDataSource");
      component.setRowDef("test");
      expect(refreshSpy).toHaveBeenCalled();
    });

    it("should set columns if rowDef is tracks", () => {
      component.tracks = MockTrack.mockTracks;
      component.setRowDef("tracks");
      expect(component.columns).toEqual(['name', 'artist', 'album', 'options']);
    });

    it("should set columns if rowDef is playlists", () => {
      component.playlists = MockPlaylist.mockPlaylists;
      component.setRowDef("playlists");
      expect(component.columns).toEqual(['name', 'tracks', 'options']);
    });

    it("should set columns if rowDef is albums", () => {
      component.albums = MockAlbum.mockAlbums;
      component.setRowDef("albums");
      expect(component.columns).toEqual(['name', 'artist', 'tracks']);
    });

    it("should set columns if rowDef is artists", () => {
      component.artists = MockArtist.mockArtists;
      component.setRowDef("artists");
      expect(component.columns).toEqual(['name', 'albums']);
    });
  });

  describe("filterChanged", () => {
    it("should filter tracks if rowDef is tracks to any track which has a name, artist, or album containing string", () => {
      component.tracks = [
        { id: "test", name: "testName", artist: "artist", album: "album", audioFile: "test" },
        { id: "test", name: "name", artist: "testArtist", album: "album", audioFile: "test" },
        { id: "test", name: "name", artist: "artist", album: "testAlbum", audioFile: "test" },
        { id: "test", name: "name", artist: "artist", album: "album", audioFile: "test" },
      ];
      component.dataSource.data = component.tracks;
      component.rowDef = RowDef.tracks;
      component.$filter.value = "test";
      component.filterChanged();
      expect(component.dataSource.data.length).toEqual(3);
      expect(JSON.stringify(component.dataSource.data[0])).toEqual(JSON.stringify({ id: "test", name: "testName", artist: "artist", album: "album", audioFile: "test" }));
      expect(JSON.stringify(component.dataSource.data[1])).toEqual(JSON.stringify({ id: "test", name: "name", artist: "testArtist", album: "album", audioFile: "test" }));
      expect(JSON.stringify(component.dataSource.data[2])).toEqual(JSON.stringify({ id: "test", name: "name", artist: "artist", album: "testAlbum", audioFile: "test" }));
    });

    it("should filter playlists if rowDef is playlists to any playlist with name containing string", () => {
      component.playlists = [
        { id: "test", name: "test1", tracks: [] },
        { id: "test", name: "test2", tracks: [] },
        { id: "test", name: "3", tracks: [] },
      ];
      component.dataSource.data = component.playlists;
      component.rowDef = RowDef.playlists;
      component.$filter.value = "test";
      component.filterChanged();
      expect(component.dataSource.data.length).toEqual(2);
      expect(JSON.stringify(component.dataSource.data[0])).toEqual(JSON.stringify({ id: "test", name: "test1", tracks: [] }));
      expect(JSON.stringify(component.dataSource.data[1])).toEqual(JSON.stringify({ id: "test", name: "test2", tracks: [] }));
    });

    it("should filter albums if rowDef is albums to any album which has a name or artist containing string", () => {
      component.albums = [
        { name: "test1", artist: "1", tracks: [] },
        { name: "2", artist: "testArtist2", tracks: [] },
        { name: "3", artist: "3", tracks: [] },
      ];
      component.dataSource.data = component.albums;
      component.rowDef = RowDef.albums;
      component.$filter.value = "test";
      component.filterChanged();
      expect(component.dataSource.data.length).toEqual(2);
      expect(JSON.stringify(component.dataSource.data[0])).toEqual(JSON.stringify({ name: "test1", artist: "1", tracks: [] }));
      expect(JSON.stringify(component.dataSource.data[1])).toEqual(JSON.stringify({ name: "2", artist: "testArtist2", tracks: [] }));
    });

    it("should filter artists if rowDef is artists to any artist with name containing string", () => {
      component.artists = [
        { name: "test1", albums: [] },
        { name: "2", albums: [] },
        { name: "test3", albums: [] },
      ];
      component.dataSource.data = component.artists;
      component.rowDef = RowDef.artists;
      component.$filter.value = "test";
      component.filterChanged();
      expect(component.dataSource.data.length).toEqual(2);
      expect(JSON.stringify(component.dataSource.data[0])).toEqual(JSON.stringify({ name: "test1", albums: [] }));
      expect(JSON.stringify(component.dataSource.data[1])).toEqual(JSON.stringify({ name: "test3", albums: [] }));
    });
  });

  describe("sortChange", () => {
    it("should call sortTracks if rowDef is 'tracks'", () => {
      component.rowDef = RowDef.tracks;
      const sortTracksSpy = spyOn(component, "sortTracks");
      component.sortChange("test");
      expect(sortTracksSpy).toHaveBeenCalledWith("test");
    });

    it("should call sortPlaylists if rowDef is 'playlists'", () => {
      component.rowDef = RowDef.playlists;
      const sortPlaylistsSpy = spyOn(component, "sortPlaylists");
      component.sortChange("test");
      expect(sortPlaylistsSpy).toHaveBeenCalledWith("test");
    });

    it("should call sortAlbums if rowDef is 'albums'", () => {
      component.rowDef = RowDef.albums;
      const sortAlbumsSpy = spyOn(component, "sortAlbums");
      component.sortChange("test");
      expect(sortAlbumsSpy).toHaveBeenCalledWith("test");
    });

    it("should call sortArtists if rowDef is 'artists'", () => {
      component.rowDef = RowDef.artists;
      const sortArtistsSpy = spyOn(component, "sortArtists");
      component.sortChange("test");
      expect(sortArtistsSpy).toHaveBeenCalledWith("test");
    });
  });

  describe("skip", () => {
    it("should do nothing if playableTracks is null or length 0", () => {
      component.playableTracks = [];
      component.skip();
      expect(component.playableTracks).toEqual([]);
      expect(component.activeTrack).toEqual(undefined);
    });

    it("should increment playableIndex and call playTrack", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.playableIndex = 0;
      const playTrackSpy = spyOn(component, "playTrack");
      component.skip();
      expect(component.playableIndex).toEqual(1);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[1]);
    });

    it("should reset playableIndex to 0 and call playTrack if playableIndex is at last track and loop is true", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.playableIndex = MockTrack.mockTracks.length - 1;
      component.loop = true;
      const playTrackSpy = spyOn(component, "playTrack");
      component.skip();
      expect(component.playableIndex).toEqual(0);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[0]);
    });

    it("playableIndex should be unchanged if playableIndex is at last track and loop is false", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.playableIndex = MockTrack.mockTracks.length - 1;
      component.loop = false;
      component.skip();
      expect(component.playableIndex).toEqual(MockTrack.mockTracks.length - 1);
    });
  });

  describe("back", () => {
    it("should decrement playableIndex and call playTrack is playableIndex is greater than zero", () => {
      component.playableIndex = 1;
      component.playableTracks = MockTrack.mockTracks;
      const playTrackSpy = spyOn(component, "playTrack");
      component.back();
      expect(component.playableIndex).toEqual(0);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[0]);
    });

    it("should set playableIndex as length of playableTracks if playableIndex becomes less than zero and loop is true", () => {
      component.playableIndex = 0;
      component.playableTracks = MockTrack.mockTracks;
      component.loop = true;
      const playTrackSpy = spyOn(component, "playTrack");
      component.back();
      expect(component.playableIndex).toEqual(component.playableTracks.length - 1);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[component.playableIndex]);
    });

    it("playableIndex should be unchanged if playableIndex becomes less than zero and loop is false", () => {
      component.playableIndex = 0;
      component.playableTracks = MockTrack.mockTracks;
      component.loop = false;
      component.back();
      expect(component.playableIndex).toEqual(0);
    });
  });

  describe("toggleShuffle", () => {
    it("should set shuffle to false if shuffle was true", () => {
      component.shuffle = true;
      component.toggleShuffle();
      expect(component.shuffle).toBeFalsy();
    });

    it("should set shuffle to true, call shuffleTracks, and set playableIndex to zero if shuffle was false", () => {
      component.shuffle = false;
      component.playableTracks = MockTrack.mockTracks;
      component.playableIndex = 1;
      component.activeTrack = component.playableTracks[component.playableIndex];
      const shuffleTracksSpy = spyOn(MusicPlayerComponent, "shuffleTracks");
      component.toggleShuffle();
      expect(component.shuffle).toBeTruthy();
      expect(component.playableIndex).toEqual(0);
      expect(shuffleTracksSpy).toHaveBeenCalled();
    });
  });

  describe("toggleLoop", () => {
    it("should set loop to true if it was false", () => {
      component.loop = false;
      component.toggleLoop();
      expect(component.loop).toBeTruthy();
    });

    it("should set loop to false if it was true", () => {
      component.loop = true;
      component.toggleLoop();
      expect(component.loop).toBeFalsy();
    });
  });

  describe("audioEnded", () => {
    it("should call playTrack and increment playableIndex if playableIndex is less than length of playableTracks", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.playableIndex = 0;
      const playTrackSpy = spyOn(component, "playTrack");
      component.audioEnded();
      expect(component.playableIndex).toEqual(1);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[component.playableIndex]);
    });

    it("should clear playableTracks if playableIndex is length of playableTracks and loop is false", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.playableIndex = component.playableTracks.length;
      component.loop = false;
      component.audioEnded();
      expect(component.playableTracks).toEqual([]);
    });

    it("should set playableIndex to 0 and call playTrack if playableIndex is length of playableTracks and loop is true", () => {
      component.playableTracks = MockTrack.mockTracks;
      component.playableIndex = component.playableTracks.length;
      component.loop = true;
      const playTrackSpy = spyOn(component, "playTrack");
      component.audioEnded();
      expect(component.playableIndex).toEqual(0);
      expect(playTrackSpy).toHaveBeenCalledWith(component.playableTracks[component.playableIndex]);
    });

    it("should call playTrack with current activeTrack if there are no playableTracks and loop is true", () => {
      component.playableTracks = [];
      component.playableIndex = 0;
      component.loop = true;
      component.activeTrack = MockTrack.mockTrack1;
      const playTrackSpy = spyOn(component, "playTrack");
      component.audioEnded();
      expect(playTrackSpy).toHaveBeenCalledWith(component.activeTrack);
    });
  });

  describe("shuffleTracks", () => {
    it("should return array of tracks", () => {
      const result = MusicPlayerComponent.shuffleTracks(MockTrack.mockTracks);
      expect(result.length).toEqual(MockTrack.mockTracks.length);
      expect(typeof(result)).toEqual(typeof(MockTrack.mockTracks));
    });
  });

  describe("buildBodyFromTrack", () => {
    it("should build body", () => {
      const request: UploadTrackRequest = { name: "test", artist: "test", album: "test", audioFile: null };
      const result = MusicPlayerComponent.buildBodyFromTrack(request);
      expect(result).toEqual(`{"name":"test","artist":"test","album":"test"}`)
    });
  });
});
