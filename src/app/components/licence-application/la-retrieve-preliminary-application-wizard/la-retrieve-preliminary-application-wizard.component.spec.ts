import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaRetrievePreliminaryApplicationWizardComponent } from './la-retrieve-preliminary-application-wizard.component';

describe('LaRetrievePreliminaryApplicationWizardComponent', () => {
  let component: LaRetrievePreliminaryApplicationWizardComponent;
  let fixture: ComponentFixture<LaRetrievePreliminaryApplicationWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaRetrievePreliminaryApplicationWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaRetrievePreliminaryApplicationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
