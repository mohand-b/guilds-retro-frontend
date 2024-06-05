import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipRequestsTabComponent } from './membership-requests-tab.component';

describe('MembershipRequestsTabComponent', () => {
  let component: MembershipRequestsTabComponent;
  let fixture: ComponentFixture<MembershipRequestsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipRequestsTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembershipRequestsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
