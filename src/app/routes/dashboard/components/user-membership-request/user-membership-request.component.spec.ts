import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMembershipRequestComponent } from './user-membership-request.component';

describe('UserMembershipRequestComponent', () => {
  let component: UserMembershipRequestComponent;
  let fixture: ComponentFixture<UserMembershipRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMembershipRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMembershipRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
