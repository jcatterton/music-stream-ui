import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrackToPlaylistComponent } from './add-track-to-playlist.component';

describe('AddTrackToPlaylistComponent', () => {
  let component: AddTrackToPlaylistComponent;
  let fixture: ComponentFixture<AddTrackToPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrackToPlaylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrackToPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
