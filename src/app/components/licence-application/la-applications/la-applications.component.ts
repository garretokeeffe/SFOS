import { Component, OnInit } from '@angular/core';
import { animations } from '../../../animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserView } from '../../../types/user';
import { UserService } from '../../../services/user.service';
import { LicenceService } from '../../../services/licence.service';
import { NotificationView } from '../../../types/notification';
import { LicenceApplicationSummaryView } from '../../../types/licence-application';
import { FleetSegmentManager } from '../../../types/fleet-segment';

@Component({
  selector: 'app-la-applications',
  templateUrl: './la-applications.component.html',
  styleUrls: ['./la-applications.component.css'],
  animations: animations,
})
export class LaApplicationsComponent implements OnInit {

  public user: UserView = null;
  public licenceApplicationSummaries: Array<LicenceApplicationSummaryView> = [];
  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods

  public loading: boolean = false;

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

  constructor(private breakpointObserver: BreakpointObserver,
              private userService: UserService,
              private licenceService: LicenceService) { }

  public ngOnInit(): void {
    this.loading = true;

    this.userService.getCurrentUser().subscribe((user: UserView) => {
        this.user = user;

        this.licenceService.getActiveLicenceApplicationSummaries(this.user.id).subscribe(
          (data: Array<LicenceApplicationSummaryView>) => {
          this.licenceApplicationSummaries = data;
          this.loading = false;
        },
          (error) => {
            console.log('Failed to get licence applications');
            this.loading = false;
          },
        );
      },
      (error) => {
        console.log('Failed to get user profile');
        this.loading = false;
      },
    );
  }

}
