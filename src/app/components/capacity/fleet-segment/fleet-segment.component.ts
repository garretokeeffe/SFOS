import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AllCapacityView, Capacity, CapacityView } from '../../../types/capacity';
import { FleetSegment, FleetSegmentManager, FleetSubSegment } from '../../../types/fleet-segment';
import { animations } from '../../../animations';

@Component({
  selector: 'app-fleet-segment',
  templateUrl: './fleet-segment.component.html',
  styleUrls: ['./fleet-segment.component.css'],
  animations: animations,
})
export class FleetSegmentComponent implements OnInit, OnChanges {

  @Input() public allCapacity: AllCapacityView = new AllCapacityView();
  @Input() public fleetSegment: number = FleetSegment['NONE'];
  @Input() public fleetSubSegments: Array<number>; // array of FleetSubSegments
  @Input() public offRegister: boolean = false;
  @Input() public pointsEnabled: boolean = false;

  public FleetSegment: any = FleetSegment; // enum reference
  public FleetSubSegment: any = FleetSubSegment; // enum reference
  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods

  public capacities: Array<Capacity | CapacityView> = [];

  constructor() { }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes['offRegister'] && changes['offRegister'].currentValue) ||
      changes['allCapacity'] && changes['allCapacity'].currentValue) {
      this.setCapacities();
    }
  }

  private setCapacities(): void {
    if (this.offRegister) {
      this.capacities = this.allCapacity.offRegister;
    } else {
      this.capacities = this.allCapacity.onRegister;
    }
  }

}
