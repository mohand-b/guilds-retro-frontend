import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllianceCardComponent } from './alliance-card.component';

describe('AllianceCardComponent', () => {
  let component: AllianceCardComponent;
  let fixture: ComponentFixture<AllianceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllianceCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllianceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
