import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaVesselInfoComponent } from './la-vessel-info.component';

describe('LaVesselInfoComponent', () => {
  let component: LaVesselInfoComponent;
  let fixture: ComponentFixture<LaVesselInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaVesselInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaVesselInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
