import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogRef } from "@angular/material/dialog";
import { MockMatDialog } from "../../mocks/services";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConfirmationDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("close", () => {
    it("should close dialogRef", () => {
      const closeSpy = spyOn(component["dialogRef"], "close");
      component.close(true);
      expect(closeSpy).toHaveBeenCalledWith(true);
    });
  });
});
