import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaConfirmQualifyingStatusComponent } from './la-confirm-qualifying-status.component';

describe('LaConfirmQualifyingStatusComponent', () => {
  let component: LaConfirmQualifyingStatusComponent;
  let fixture: ComponentFixture<LaConfirmQualifyingStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaConfirmQualifyingStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaConfirmQualifyingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
