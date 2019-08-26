import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VesselView } from 'src/app/types/vessel';
import { VesselCardInfo } from 'src/app/types/vesselCardInfo';
import { animations } from '../../animations';
import {Globals} from '../../globals';

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.css'],
  animations: animations,
})
export class VesselComponent implements OnInit {

  @Input() private vessel: VesselView;
  @Input() private vCardInfo: VesselCardInfo;
  @Input() private notificationBadge: string = null;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
  .pipe(
    map((result) => result.matches),
  );

  public display: string = 'IMAGE'; // IMAGE | LOCATION (by default show vessel image)
  public showAllAdditionalVessionDetails: boolean = false;

  constructor(private globals: Globals,
              private breakpointObserver: BreakpointObserver) { }

  public ngOnInit(): void { }

}
