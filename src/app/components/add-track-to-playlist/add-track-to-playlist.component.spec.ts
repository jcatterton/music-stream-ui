import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTrackToPlaylistComponent } from './add-track-to-playlist.component';
import { FormBuilder } from "@angular/forms";
import { MockMatDialog } from "../../mocks/services";
import { MatDialogRef } from "@angular/material/dialog";

describe('AddTrackToPlaylistComponent', () => {
  let component: AddTrackToPlaylistComponent;
  let fixture: ComponentFixture<AddTrackToPlaylistComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrackToPlaylistComponent ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useClass: MockMatDialog }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrackToPlaylistComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should create form", () => {
      const formSpy = spyOn(formBuilder, "group");
      component.ngOnInit();
      expect(formSpy).toHaveBeenCalled();
    });
  });

  describe("onOk", () => {
    it("should close dialog ref", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.form.controls["id"].setValue("test");
      component.onOk();
      expect(closeSpy).toHaveBeenCalledWith("test");
    });
  });

  describe("cancel", () => {
    it("should close dialog ref", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.cancel();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
