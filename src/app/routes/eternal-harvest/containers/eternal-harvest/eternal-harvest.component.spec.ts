import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EternalHarvestComponent } from './eternal-harvest.component';

describe('EternalHarvestComponent', () => {
  let component: EternalHarvestComponent;
  let fixture: ComponentFixture<EternalHarvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EternalHarvestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EternalHarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
