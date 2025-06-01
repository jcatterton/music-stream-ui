import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumInfoComponent } from './album-info.component';
import { MockMatDialog } from "../../mocks/services";
import { MatDialogRef } from "@angular/material/dialog";
import { MockAlbum } from "../../mocks/albums";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
describe('AlbumInfoComponent', () => {
  let component: AlbumInfoComponent;
  let fixture: ComponentFixture<AlbumInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumInfoComponent ],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumInfoComponent);
    component = fixture.componentInstance;
    component.album = MockAlbum.mockAlbum1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("playAll", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.album = { name: "testName", artist: "testArtist", tracks: [] };
      component.playAll();
      expect(closeSpy).toHaveBeenCalledWith({ output: component.album.tracks, type: "multiple" });
    });
  });

  describe("playOne", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      const testTrack = { id: "testId", name: "testName", album: "testAlbum", artist: "testArtist", audioFile: "testAudioId" };
      component.playOne(testTrack);
      expect(closeSpy).toHaveBeenCalledWith({ output: testTrack, type: "single" });
    });
  });

  describe("close", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.close();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("goToArtist", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.album = { name: "testName", artist: "testArtist", tracks: [] };
      component.goToArtist();
      expect(closeSpy).toHaveBeenCalledWith({ output: component.album.artist, type: "artist" });
    });
  });
});
