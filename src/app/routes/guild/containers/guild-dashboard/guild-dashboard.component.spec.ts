import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GuildDashboardComponent} from './guild-dashboard.component';

describe('GuildComponent', () => {
  let component: GuildDashboardComponent;
  let fixture: ComponentFixture<GuildDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GuildDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
