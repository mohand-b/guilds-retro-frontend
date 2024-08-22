import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobLevelComponent } from './edit-job-level.component';

describe('EditJobLevelComponent', () => {
  let component: EditJobLevelComponent;
  let fixture: ComponentFixture<EditJobLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditJobLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditJobLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
