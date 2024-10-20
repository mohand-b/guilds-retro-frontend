import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSummaryPreviewComponent } from './event-summary-preview.component';

describe('EventSummaryPreviewComponent', () => {
  let component: EventSummaryPreviewComponent;
  let fixture: ComponentFixture<EventSummaryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSummaryPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSummaryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
