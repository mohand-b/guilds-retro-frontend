import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDisplayComponent } from './job-display.component';

describe('JobDisplayComponent', () => {
  let component: JobDisplayComponent;
  let fixture: ComponentFixture<JobDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
