import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLeaderComponent } from './register-leader.component';

describe('RegisterLeaderComponent', () => {
  let component: RegisterLeaderComponent;
  let fixture: ComponentFixture<RegisterLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
