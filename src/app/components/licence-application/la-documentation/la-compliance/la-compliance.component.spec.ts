import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaComplianceComponent } from './la-compliance.component';

describe('LaComplianceComponent', () => {
  let component: LaComplianceComponent;
  let fixture: ComponentFixture<LaComplianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaComplianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
