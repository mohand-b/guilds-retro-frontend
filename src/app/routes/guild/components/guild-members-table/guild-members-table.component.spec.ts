import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildMembersTableComponent } from './guild-members-table.component';

describe('GuildMembersTableComponent', () => {
  let component: GuildMembersTableComponent;
  let fixture: ComponentFixture<GuildMembersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildMembersTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildMembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
