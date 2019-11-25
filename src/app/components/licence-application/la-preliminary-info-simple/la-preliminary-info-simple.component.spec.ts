import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaPreliminaryInfoSimpleComponent } from './la-preliminary-info-simple.component';

describe('LaPreliminaryInfoSimpleComponent', () => {
  let component: LaPreliminaryInfoSimpleComponent;
  let fixture: ComponentFixture<LaPreliminaryInfoSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaPreliminaryInfoSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaPreliminaryInfoSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
