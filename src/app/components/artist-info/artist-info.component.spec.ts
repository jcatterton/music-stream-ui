import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistInfoComponent } from './artist-info.component';
import { MockMatDialog } from "../../mocks/services";
import { MatDialogRef } from "@angular/material/dialog";
import { MockArtist } from "../../mocks/artists";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('ArtistInfoComponent', () => {
  let component: ArtistInfoComponent;
  let fixture: ComponentFixture<ArtistInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistInfoComponent ],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistInfoComponent);
    component = fixture.componentInstance;
    component.artist = MockArtist.mockArtist1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("playAll", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.artist = { name: "testName", albums: [{ name: "testAlbum", artist: "testName", tracks: [] }] };
      component.playAll();
      expect(closeSpy).toHaveBeenCalledWith({ output: [], type: "tracks" });
    });
  });

  describe("close", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.close();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("selectAlbum", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      const testAlbum = { name: "testName", artist: "testArtist", tracks: [] };
      component.selectAlbum(testAlbum);
      expect(closeSpy).toHaveBeenCalledWith({ output: testAlbum, type: "album" });
    });
  });
});
