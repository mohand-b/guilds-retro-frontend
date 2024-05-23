import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildSelectedCardComponent } from './guild-selected-card.component';

describe('GuildSelectedCardComponent', () => {
  let component: GuildSelectedCardComponent;
  let fixture: ComponentFixture<GuildSelectedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildSelectedCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildSelectedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
