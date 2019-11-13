import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaRetrievePreliminaryApplicationComponent } from './la-retrieve-preliminary-application.component';

describe('LaRetrievePreliminaryApplicationComponent', () => {
  let component: LaRetrievePreliminaryApplicationComponent;
  let fixture: ComponentFixture<LaRetrievePreliminaryApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaRetrievePreliminaryApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaRetrievePreliminaryApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
