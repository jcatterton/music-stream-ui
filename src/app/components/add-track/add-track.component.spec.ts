import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTrackComponent } from './add-track.component';
import { FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MockMatDialog } from "../../mocks/services";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('AddPlaylistComponent', () => {
  let component: AddTrackComponent;
  let fixture: ComponentFixture<AddTrackComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrackComponent ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrackComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should build form", () => {
      const formSpy = spyOn(formBuilder, "group");
      component.ngOnInit();
      expect(formSpy).toHaveBeenCalled();
    });
  });

  describe("setFile", () => {
    it("should set file", () => {
      component.file = null;
      const testFile = new File([], "test");
      const event = { target: { files: [testFile]} };
      component.setFile(event);
      expect(component.file).toEqual(testFile);
    });

    it("should set file form control value as file", () => {
      component.file = null;
      const testFile = new File([], "test");
      const event = { target: { files: [testFile]} };
      component.setFile(event);
      expect(component.form.controls["file"].value).toEqual(testFile);
    });
  });

  describe("cancel", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.cancel();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("addTrack", () => {
    it("should close dialogRef with track", () => {
      const testFile = new File([], "test");
      component.form.controls["name"].setValue("testName");
      component.form.controls["album"].setValue("testAlbum");
      component.form.controls["artist"].setValue("testArtist");
      component.form.controls["file"].setValue(testFile);
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.addTrack();
      expect(closeSpy).toHaveBeenCalledWith({
        name: "testName",
        album: "testAlbum",
        artist: "testArtist",
        audioFile: testFile,
      });
    });
  });
});
