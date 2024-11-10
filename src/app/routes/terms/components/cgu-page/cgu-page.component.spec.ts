import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CguPageComponent} from './cgu-page.component';

describe('CguComponent', () => {
  let component: CguPageComponent;
  let fixture: ComponentFixture<CguPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CguPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CguPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
