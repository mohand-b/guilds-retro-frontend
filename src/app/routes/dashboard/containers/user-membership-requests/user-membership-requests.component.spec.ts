import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMembershipRequestsComponent } from './user-membership-requests.component';

describe('UserMembershipRequestsComponent', () => {
  let component: UserMembershipRequestsComponent;
  let fixture: ComponentFixture<UserMembershipRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMembershipRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMembershipRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
