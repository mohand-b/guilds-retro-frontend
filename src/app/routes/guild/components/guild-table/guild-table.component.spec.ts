import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildTableComponent } from './guild-table.component';

describe('GuildTableComponent', () => {
  let component: GuildTableComponent;
  let fixture: ComponentFixture<GuildTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
