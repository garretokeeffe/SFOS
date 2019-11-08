import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaWizardComponent } from './la-wizard.component';

describe('LaWizardComponent', () => {
  let component: LaWizardComponent;
  let fixture: ComponentFixture<LaWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
