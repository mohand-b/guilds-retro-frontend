import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildsRegistryComponent } from './guilds-registry.component';

describe('GuildsRegistryComponent', () => {
  let component: GuildsRegistryComponent;
  let fixture: ComponentFixture<GuildsRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuildsRegistryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuildsRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
