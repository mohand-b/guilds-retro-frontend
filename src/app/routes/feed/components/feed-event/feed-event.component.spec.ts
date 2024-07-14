import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedEventComponent } from './feed-event.component';

describe('FeedEventComponent', () => {
  let component: FeedEventComponent;
  let fixture: ComponentFixture<FeedEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
