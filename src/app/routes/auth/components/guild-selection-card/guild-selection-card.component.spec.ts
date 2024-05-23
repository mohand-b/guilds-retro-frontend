import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildSelectionCardComponent } from './guild-selection-card.component';

describe('GuildSelectionCardComponent', () => {
  let component: GuildSelectionCardComponent;
  let fixture: ComponentFixture<GuildSelectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildSelectionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildSelectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
