import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaDownloadFormsComponent } from './la-download-forms.component';

describe('LaDownloadFormsComponent', () => {
  let component: LaDownloadFormsComponent;
  let fixture: ComponentFixture<LaDownloadFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaDownloadFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaDownloadFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
