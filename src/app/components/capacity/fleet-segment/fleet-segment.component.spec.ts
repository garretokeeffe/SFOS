import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetSegmentComponent } from './fleet-segment.component';

describe('FleetSegmentComponent', () => {
  let component: FleetSegmentComponent;
  let fixture: ComponentFixture<FleetSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
