import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllianceRequestRowComponent } from './alliance-request-row.component';

describe('AllianceRequestRowComponent', () => {
  let component: AllianceRequestRowComponent;
  let fixture: ComponentFixture<AllianceRequestRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllianceRequestRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllianceRequestRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
