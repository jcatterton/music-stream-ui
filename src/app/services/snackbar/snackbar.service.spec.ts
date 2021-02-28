import {TestBed} from '@angular/core/testing';
import {SnackBarPanelClass, SnackbarService} from './snackbar.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from "@angular/material/snack-bar";

class MockMatSnackBar {
  open(message: string, action?: string, config?: MatSnackBarConfig) {}
}

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        SnackbarService,
        {
          provide: MatSnackBar,
          useClass: MockMatSnackBar
        }
      ]
    });
    service = TestBed.inject(SnackbarService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("showMessage", () => {
    it("should call snackbar open", () => {
      const showMessageSpy = spyOn(snackBar, "open");
      service.showMessage("test", SnackBarPanelClass.fail);
      const matSnackBarConfig = new MatSnackBarConfig();
      matSnackBarConfig.duration = 5000;
      matSnackBarConfig.panelClass = SnackBarPanelClass.fail;
      expect(showMessageSpy).toHaveBeenCalledWith("test", "x", matSnackBarConfig)
    });
  });
});
