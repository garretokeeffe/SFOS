import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceApplicationComponent } from './licence-application.component';

describe('LicenceApplicationComponent', () => {
  let component: LicenceApplicationComponent;
  let fixture: ComponentFixture<LicenceApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenceApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
