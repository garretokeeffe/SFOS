import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { LicenceService } from '../../services/licence.service';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { Utils } from '../../services/utils.service';
import { VesselService } from '../../services/vessel.service';
import { Notification, NotificationView} from '../../types/notification';
import { SubmissionView } from '../../types/submission';
import { UserView } from '../../types/user';
import { VesselView } from '../../types/vessel';
import { VesselCardInfo } from '../../types/vesselCardInfo';
import { animations } from '../../animations';

@Component({
  selector: 'app-vessels',
  templateUrl: './vessels.component.html',
  styleUrls: ['./vessels.component.css'],
  animations: animations,
})
export class VesselsComponent implements OnInit {

  @Input() embedded: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  title$: Observable<object>;

  public user: UserView = null;
  public vessels: Array<VesselView> = [];
  public notifications: Array<NotificationView> = [];
  public submissions: Array<SubmissionView> = [];

  public utils: Utils = Utils;
  public showSubmissions: boolean = false; // If UX is approved, remove the submissions panel and references to showSubmissions from this screen. For now switch it off.
  public hideNotifications: boolean = true;
  public hideApplicationStatuses: boolean = true;

  public errorMessage: string = '';

  constructor(public activatedRoute: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              public appComponent: AppComponent,
              public userService: UserService,
              public licenceService: LicenceService,
              public notificationService: NotificationService,
              public vesselService: VesselService) { }

  public ngOnInit(): void {
    this.title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));
    this.errorMessage = '';

    this.userService.getUserProfile().subscribe((user: UserView) => {
      this.user = user;

      this.vesselService.getVessels(user.id).subscribe((vessels: Array<VesselView>) => {
        this.vessels = vessels.sort((v1, v2) => {
          return (v1.name < v2.name ? -1 : 1); // ascending
        });
      },
    (error) => {
        console.error('Failed to retrieve vessels');
        this.vessels = [];
        this.errorMessage = 'Sorry, something went wrong. Your vessels could not be retrieved at this time.';
      });
    },
    (error) => {
      console.error('Failed to retrieve user profile and hence vessels');
      this.errorMessage = 'Sorry, something went wrong. Your vessels could not be retrieved at this time.';
    });

    /*
    this.licenceService.getStatusesOfSubmissions().subscribe(submissions => {
        this.submissions = submissions;
      },
      error => {
        console.error('Failed to retrieve notifications');
        this.notifications = [];
      });

    this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      },
      error => {
        console.error('Failed to retrieve notifications');
        this.notifications = [];
      });
    */
  }

  public getVesselNotificationsBadge(vessel: VesselView): number {
    const count: number = this.notifications.filter((notification) => notification.vesselId === vessel.id).length;
    return count > 0 ? count : null;
  }

  // NOT USED
  public getResponsiveDateFormat(isHandset: Observable<boolean>): Observable<string> {
    return new Observable((observer) => {
      observer.next(isHandset ? 'E, d LLL' : 'EEEE, d LLLL yyyy');
      observer.complete();
    });
  }

  public goToNotificationItem(notification: NotificationView): void {

  }
  public goToSubmissionItem(submission: SubmissionView): void {

  }

  public createVesselCardInfo(idx: number, totalVessels: number): VesselCardInfo {
    const vesselCard: VesselCardInfo = new VesselCardInfo(idx, totalVessels);
    vesselCard.index = idx;
    vesselCard.totalVessels = totalVessels;
    return vesselCard;
  }
}
