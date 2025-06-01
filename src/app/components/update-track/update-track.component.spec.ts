import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateTrackComponent } from './update-track.component';
import { FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MockMatDialog } from "../../mocks/services";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('UpdateTrackComponent', () => {
  let component: UpdateTrackComponent;
  let fixture: ComponentFixture<UpdateTrackComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTrackComponent ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTrackComponent);
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

  describe("cancel", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.cancel();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("updateTrack", () => {
    it("should close dialogRef with track", () => {
      component.form.controls["name"].setValue("testName");
      component.form.controls["album"].setValue("testAlbum");
      component.form.controls["artist"].setValue("testArtist");
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.updateTrack();
      expect(closeSpy).toHaveBeenCalledWith({
        name: "testName",
        album: "testAlbum",
        artist: "testArtist",
      });
    });
  });
});
