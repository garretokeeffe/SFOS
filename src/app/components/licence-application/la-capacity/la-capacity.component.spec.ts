import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaCapacityComponent } from './la-capacity.component';

describe('LaCapacityComponent', () => {
  let component: LaCapacityComponent;
  let fixture: ComponentFixture<LaCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
