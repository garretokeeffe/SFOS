import { Component, Input, OnInit } from '@angular/core';
import { animations } from '../../../animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FleetSegmentManager, FleetSubSegment } from '../../../types/fleet-segment';
import { Utils } from '../../../services/utils.service';

@Component({
  selector: 'app-la-header',
  templateUrl: './la-header.component.html',
  styleUrls: ['./la-header.component.css'],
  animations: animations,
})
export class LaHeaderComponent implements OnInit {

  @Input() public arn: string = '';
  @Input() public fleetSegment: number = null;

  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods
  public FleetSubSegment: any = FleetSubSegment;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastLarge$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );

  constructor(public breakpointObserver: BreakpointObserver,
              public utils: Utils) { }

  public ngOnInit(): void {
  }

  public isScallops(): boolean {
    return [FleetSubSegment['POLYVALENT_SCALLOPS_GTE_10M_LOA'], FleetSubSegment['SPECIFIC_SCALLOPS_GTE_10M_LOA']].includes(Number(this.fleetSegment));
  }

}
