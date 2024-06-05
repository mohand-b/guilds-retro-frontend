import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildHeaderComponent } from './guild-header.component';

describe('GuildHeaderComponent', () => {
  let component: GuildHeaderComponent;
  let fixture: ComponentFixture<GuildHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
