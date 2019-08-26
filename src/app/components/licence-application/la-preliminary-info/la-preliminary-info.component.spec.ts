import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaPreliminaryInfoComponent } from './la-preliminary-info.component';

describe('LaPreliminaryInfoComponent', () => {
  let component: LaPreliminaryInfoComponent;
  let fixture: ComponentFixture<LaPreliminaryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaPreliminaryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaPreliminaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
