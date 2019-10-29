import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaLetterOfOfferComponent0 } from './la-letter-of-offer-component0.component';

describe('LaLetterOfOfferComponent0', () => {
  let component: LaLetterOfOfferComponent0;
  let fixture: ComponentFixture<LaLetterOfOfferComponent0>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaLetterOfOfferComponent0 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaLetterOfOfferComponent0);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
