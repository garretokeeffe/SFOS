import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVesselOwnerComponent } from './home-vessel-owner.component';

describe('HomeVesselOwnerComponent', () => {
  let component: HomeVesselOwnerComponent;
  let fixture: ComponentFixture<HomeVesselOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeVesselOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeVesselOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
