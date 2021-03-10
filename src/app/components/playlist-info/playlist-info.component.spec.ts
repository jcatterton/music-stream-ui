import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistInfoComponent } from './playlist-info.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TrackService } from "../../services/track/track.service";
import { MockMatDialog, MockPlaylistService, MockSnackBarService, MockTrackService } from "../../mocks/services";
import { PlaylistService } from "../../services/playlist/playlist.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SnackBarPanelClass, SnackbarService } from "../../services/snackbar/snackbar.service";
import { MockTrack } from "../../mocks/tracks";
import { MockPlaylist } from "../../mocks/playlists";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { of, throwError } from "rxjs";

describe('PlaylistInfoComponent', () => {
  let component: PlaylistInfoComponent;
  let fixture: ComponentFixture<PlaylistInfoComponent>;
  let trackService: MockTrackService;
  let playlistService: MockPlaylistService;
  let snackBarService: MockSnackBarService;
  let dialogService: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistInfoComponent ],
      providers: [
        HttpClientTestingModule,
        { provide: TrackService, useClass: MockTrackService },
        { provide: PlaylistService, useClass: MockPlaylistService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: SnackbarService, useClass: MockSnackBarService },
        { provide: MatDialogRef, useClass: MockMatDialog }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistInfoComponent);
    component = fixture.componentInstance;
    component.playlist = JSON.parse(JSON.stringify(MockPlaylist.mockPlaylist1));
    trackService = TestBed.inject(TrackService);
    playlistService = TestBed.inject(PlaylistService);
    snackBarService = TestBed.inject(SnackbarService);
    dialogService = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should call getTracks", () => {
      const getTracksSpy = spyOn(component, "getTracks");
      component.ngOnInit();
      expect(getTracksSpy).toHaveBeenCalled();
    });
  });

  describe("playAll", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.playAll();
      expect(closeSpy).toHaveBeenCalledWith({ output: component.tracks, type: "multiple" });
    });
  });

  describe("playOne", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.playOne(MockTrack.mockTrack1);
      expect(closeSpy).toHaveBeenCalledWith({ output: MockTrack.mockTrack1, type: "single" });
    });
  });

  describe("close", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.close();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("deletePlaylist", () => {
    it("should call dialogService open", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const openSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.deletePlaylist();
      expect(openSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, { width: "700px", disableClose: false });
    });

    it("should call playlistService deletePlaylist on truthy response", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const deleteSpy = spyOn(playlistService, "deletePlaylist");
      component.deletePlaylist();
      expect(deleteSpy).toHaveBeenCalledWith(component.playlist.id);
    });

    it("should not call playlistService deletePlaylist on falsy response", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(false),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const deleteSpy = spyOn(playlistService, "deletePlaylist");
      component.deletePlaylist();
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it("should call dialogRef close if playlist is successfully deleted", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "deletePlaylist").and.callThrough();
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.deletePlaylist();
      expect(closeSpy).toHaveBeenCalled();
    });

    it("should call snackBarService showMessage on deletePlaylist error", () => {
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "deletePlaylist").and.returnValue(throwError("test"));
      const closeSpy = spyOn(snackBarService, "showMessage");
      component.deletePlaylist();
      expect(closeSpy).toHaveBeenCalledWith("Error deleting playlist", SnackBarPanelClass.fail);
    });
  });

  describe("removeTrackFromPlaylist", () => {
    it("should call dialogService open", () => {
      component.tracks = MockTrack.mockTracks;
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(),
        componentInstance: {}
      });
      const openSpy = spyOn(dialogService, "open").and.returnValue(dialogRef);
      component.removeTrackFromPlaylist(component.tracks[0]);
      expect(openSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, { width: "700px", disableClose: false });
    });

    it("should call playlistService deletePlaylist on truthy response", () => {
      component.tracks = MockTrack.mockTracks;
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const deleteSpy = spyOn(playlistService, "deleteTrackFromPlaylist");
      component.removeTrackFromPlaylist(component.tracks[0]);
      expect(deleteSpy).toHaveBeenCalledWith(component.playlist.id, component.tracks[0].id);
    });

    it("should not call playlistService deletePlaylist on falsy response", () => {
      component.tracks = MockTrack.mockTracks;
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(false),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      const deleteSpy = spyOn(playlistService, "deleteTrackFromPlaylist");
      component.removeTrackFromPlaylist(component.tracks[0]);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it("should show snackbar and call getTracks on successful delete", () => {
      component.tracks = MockTrack.mockTracks;
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "deleteTrackFromPlaylist").and.callThrough();
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      const getTracksSpy = spyOn(component, "getTracks");
      component.removeTrackFromPlaylist(component.tracks[0]);
      expect(snackBarSpy).toHaveBeenCalledWith("Track successfully removed from playlist", SnackBarPanelClass.success);
      expect(getTracksSpy).toHaveBeenCalled();
    });

    it("should call snackbarService showMessage if delete fails", () => {
      component.tracks = MockTrack.mockTracks;
      const dialogRef = jasmine.createSpyObj({
        afterClosed: of(true),
        componentInstance: {}
      });
      spyOn(dialogService, "open").and.returnValue(dialogRef);
      spyOn(playlistService, "deleteTrackFromPlaylist").and.returnValue(throwError("test"));
      const snackBarSpy = spyOn(snackBarService, "showMessage");
      component.removeTrackFromPlaylist(component.tracks[0]);
      expect(snackBarSpy).toHaveBeenCalledWith("Error removing track from playlist", SnackBarPanelClass.fail);
    });
  });
});
