import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlaylistComponent } from './add-playlist.component';
import { MatDialogRef } from "@angular/material/dialog";
import { MockMatDialog } from "../../mocks/services";
import { FormBuilder } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('AddPlaylistComponent', () => {
  let component: AddPlaylistComponent;
  let fixture: ComponentFixture<AddPlaylistComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlaylistComponent ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaylistComponent);
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

  describe("addPlaylist", () => {
    it("should close dialog ref", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.form.controls["name"].setValue("test");
      component.addPlaylist();
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
