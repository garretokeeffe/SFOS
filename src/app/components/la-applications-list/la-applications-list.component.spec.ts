import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaApplicationsListComponent } from './la-applications-list.component';

describe('LaApplicationsListComponent', () => {
  let component: LaApplicationsListComponent;
  let fixture: ComponentFixture<LaApplicationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaApplicationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
