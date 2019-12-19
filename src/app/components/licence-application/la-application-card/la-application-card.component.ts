import { Component, Input, OnInit } from '@angular/core';
import { LaWizardMode } from '../la-wizard/la-wizard.component';
import { LicenceApplicationStatus, LicenceApplicationSummary } from '../../../types/licence-application';
import { FleetSegmentManager } from '../../../types/fleet-segment';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Globals } from '../../../globals';
import { animations } from '../../../animations';
import { Utils } from '../../../services/utils.service';
import { UserType } from '../../../types/user';

@Component({
  selector: 'app-la-application-card',
  templateUrl: './la-application-card.component.html',
  styleUrls: ['./la-application-card.component.css'],
  animations: animations,
})
export class LaApplicationCardComponent implements OnInit {

  @Input() public licenceApplicationSummary: LicenceApplicationSummary = null;

  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods
  public ApplicantType: any = UserType; // access to static methods
  public LicenceApplicationStatus: any = LicenceApplicationStatus; // access to static methods
  public LaWizardMode: any = LaWizardMode; // access to static methods
  public utils: Utils = Utils;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isMediumOrSmaller$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.Medium])
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

  constructor(public globals: Globals,
              private breakpointObserver: BreakpointObserver){ }

  public ngOnInit(): void {
  }

}
