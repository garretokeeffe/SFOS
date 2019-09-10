import { Component, Input, OnInit } from '@angular/core';
import { CapacityView } from '../../../types/capacity';
import { animations } from '../../../animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vessel-capacity-card',
  templateUrl: './vessel-capacity-card.component.html',
  styleUrls: ['./vessel-capacity-card.component.css'],
  animations: animations,
})
export class VesselCapacityCardComponent implements OnInit {

  @Input() public capacity: CapacityView = null;
  @Input() public pointsEnabled: boolean = false;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(public breakpointObserver: BreakpointObserver) { }

  public ngOnInit(): void {
  }

}
