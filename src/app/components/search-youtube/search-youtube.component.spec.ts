import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchYoutubeComponent } from './search-youtube.component';

describe('SearchYoutubeComponent', () => {
  let component: SearchYoutubeComponent;
  let fixture: ComponentFixture<SearchYoutubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchYoutubeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
