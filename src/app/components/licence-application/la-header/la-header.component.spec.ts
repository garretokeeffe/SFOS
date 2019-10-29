import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaHeaderComponent } from './la-header.component';

describe('LaHeaderComponent', () => {
  let component: LaHeaderComponent;
  let fixture: ComponentFixture<LaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
