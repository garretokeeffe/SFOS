import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLicensingComponent } from './home-licensing.component';

describe('HomeVesselOwnerComponent', () => {
  let component: HomeLicensingComponent;
  let fixture: ComponentFixture<HomeLicensingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLicensingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLicensingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
