import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaApplicationComponent } from './la-application.component';

describe('LaApplicationComponent', () => {
  let component: LaApplicationComponent;
  let fixture: ComponentFixture<LaApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
