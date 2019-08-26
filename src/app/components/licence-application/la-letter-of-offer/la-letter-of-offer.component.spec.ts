import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaLetterOfOfferComponent } from './la-letter-of-offer.component';

describe('LaLetterOfOfferComponent', () => {
  let component: LaLetterOfOfferComponent;
  let fixture: ComponentFixture<LaLetterOfOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaLetterOfOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaLetterOfOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
