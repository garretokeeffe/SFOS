import {AfterViewChecked, Component, DoCheck, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {AppComponent} from '../../app.component';
import {UserService} from '../../services/user.service';
import {LicenceService} from '../../services/licence.service';
import {NotificationService} from '../../services/notification.service';
import {VesselService} from '../../services/vessel.service';
import {VesselView} from '../../types/vessel';
import {NotificationView} from '../../types/notification';
import {SubmissionView} from '../../types/submission';
import {UserView} from '../../types/user';
import {Utils} from '../../services/utils.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-licences',
  templateUrl: './licences.component.html',
  styleUrls: ['./licences.component.css']
})
export class LicencesComponent implements OnInit, DoCheck {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  title$: Observable<object> = this.title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));

  public user: UserView = null;
  public vessels: Array<VesselView> = [];
  public notifications: Array<NotificationView> = [];
  public submissions: Array<SubmissionView> = [];

  public showLicenceApplication: boolean = false;

  public utils: Utils = Utils;


  constructor(public activatedRoute: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              public appComponent: AppComponent,
              public userService: UserService,
              public applicationService: LicenceService,
              public notificationService: NotificationService,
              public vesselService: VesselService) { }

  ngOnInit() {

    // title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));

    this.userService.getUserByUserId().subscribe(user => {
        this.user = user;
      },
      error => {
        console.error('Failed to retrieve user');
        this.user = null;
      });

    this.vesselService.getVessels().subscribe(vessels => {
        this.vessels = vessels;
      },
      error => {
        console.error('Failed to retrieve vessels');
        this.vessels = [];
      });

    this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      },
      error => {
        console.error('Failed to retrieve notifications');
        this.notifications = [];
      });

  }

  public ngDoCheck() {

  }

  public getVesselNotificationsBadge(vessel: VesselView): number {
    const count: number = this.notifications.filter((notification) => notification.vesselId === vessel.id).length;
    return count > 0 ? count : null;
  }


}
