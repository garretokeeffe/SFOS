import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaSubmitManuallyComponent } from './la-submit-manually.component';

describe('LaSubmitManuallyComponent', () => {
  let component: LaSubmitManuallyComponent;
  let fixture: ComponentFixture<LaSubmitManuallyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaSubmitManuallyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaSubmitManuallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
