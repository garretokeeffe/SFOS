import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselCapacityCardComponent } from './vessel-capacity-card.component';

describe('VesselCapacityCardComponent', () => {
  let component: VesselCapacityCardComponent;
  let fixture: ComponentFixture<VesselCapacityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselCapacityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselCapacityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
