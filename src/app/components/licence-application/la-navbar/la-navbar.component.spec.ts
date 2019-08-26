import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaNavbarComponent } from './la-navbar.component';

describe('LaNavbarComponent', () => {
  let component: LaNavbarComponent;
  let fixture: ComponentFixture<LaNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
