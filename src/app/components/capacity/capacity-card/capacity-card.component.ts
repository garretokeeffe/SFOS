import {
  Component,
  Input,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AllCapacityView, CapacityView } from '../../../types/capacity';
import { FleetSegment, FleetSubSegment } from '../../../types/fleet-segment';
import { animations } from '../../../animations';

@Component({
  selector: 'app-capacity-card',
  templateUrl: './capacity-card.component.html',
  styleUrls: ['./capacity-card.component.css'],
  animations: animations,
})
export class CapacityCardComponent {

  @Input() public capacities: Array<CapacityView> = [];
  @Input() public showSubSegmentTotal: boolean = false;
  @Input() public offRegister: boolean = false;
  @Input() public pointsEnabled: boolean = false;

  public FleetSegment: any = FleetSegment; // enum reference
  public FleetSubSegment: any = FleetSubSegment; // enum reference
  public allCapacities: AllCapacityView = new AllCapacityView(); // static reference

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(public breakpointObserver: BreakpointObserver) { }
}
