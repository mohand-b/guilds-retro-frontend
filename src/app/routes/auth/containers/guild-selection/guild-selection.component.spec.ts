import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildSelectionComponent } from './guild-selection.component';

describe('GuildSelectionComponent', () => {
  let component: GuildSelectionComponent;
  let fixture: ComponentFixture<GuildSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
