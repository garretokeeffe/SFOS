import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchlimitsComponent } from './catchlimits.component';

describe('CatchlimitsComponent', () => {
  let component: CatchlimitsComponent;
  let fixture: ComponentFixture<CatchlimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatchlimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchlimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
