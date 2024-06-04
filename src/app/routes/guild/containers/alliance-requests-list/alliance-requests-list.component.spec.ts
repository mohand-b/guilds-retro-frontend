import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllianceRequestsListComponent } from './alliance-requests-list.component';

describe('AllianceRequestsListComponent', () => {
  let component: AllianceRequestsListComponent;
  let fixture: ComponentFixture<AllianceRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllianceRequestsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllianceRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
