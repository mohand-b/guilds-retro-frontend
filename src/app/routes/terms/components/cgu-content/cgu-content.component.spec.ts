import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CguContentComponent } from './cgu-content.component';

describe('CguContentComponent', () => {
  let component: CguContentComponent;
  let fixture: ComponentFixture<CguContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CguContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CguContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
