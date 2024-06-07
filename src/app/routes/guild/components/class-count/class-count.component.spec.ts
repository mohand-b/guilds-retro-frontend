import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCountComponent } from './class-count.component';

describe('ClassCountComponent', () => {
  let component: ClassCountComponent;
  let fixture: ComponentFixture<ClassCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
