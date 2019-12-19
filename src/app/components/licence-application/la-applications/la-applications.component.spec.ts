import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaApplicationsComponent } from './la-applications.component';

describe('LaApplicationsComponent', () => {
  let component: LaApplicationsComponent;
  let fixture: ComponentFixture<LaApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
