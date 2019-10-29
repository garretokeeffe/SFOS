import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaLicenceApplicationWizardComponent } from './la-licence-application-wizard.component';

describe('LaLicenceApplicationWizardComponent', () => {
  let component: LaLicenceApplicationWizardComponent;
  let fixture: ComponentFixture<LaLicenceApplicationWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaLicenceApplicationWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaLicenceApplicationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
