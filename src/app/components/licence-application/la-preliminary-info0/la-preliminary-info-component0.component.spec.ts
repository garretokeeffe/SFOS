import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaPreliminaryInfoComponent0 } from './la-preliminary-info-component0.component';

describe('LaPreliminaryInfoComponent0', () => {
  let component: LaPreliminaryInfoComponent0;
  let fixture: ComponentFixture<LaPreliminaryInfoComponent0>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaPreliminaryInfoComponent0 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaPreliminaryInfoComponent0);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
