import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLinkedAccountComponent } from './add-linked-account.component';

describe('AddLinkedAccountComponent', () => {
  let component: AddLinkedAccountComponent;
  let fixture: ComponentFixture<AddLinkedAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLinkedAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLinkedAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
