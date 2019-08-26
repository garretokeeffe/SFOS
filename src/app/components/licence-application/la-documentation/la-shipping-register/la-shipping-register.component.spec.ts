import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaShippingRegisterComponent } from './la-shipping-register.component';

describe('LaShippingRegisterComponent', () => {
  let component: LaShippingRegisterComponent;
  let fixture: ComponentFixture<LaShippingRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaShippingRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaShippingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
