import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaDocumentationComponent } from './la-conditions.component';

describe('LaConditionsComponent', () => {
  let component: LaDocumentationComponent;
  let fixture: ComponentFixture<LaDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
