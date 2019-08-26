import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {UserView} from '../../types/user';
import {NotificationView} from '../../types/notification';
import {SubmissionView} from '../../types/submission';
import {Utils} from '../../services/utils.service';
import {AppComponent} from '../../app.component';
import {UserService} from '../../services/user.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-home-representative',
  templateUrl: './home-representative.component.html',
  styleUrls: ['./home-representative.component.css']
})
export class HomeRepresentativeComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  public user: UserView = null;
  public notifications: Array<NotificationView> = [];
  public submissions: Array<SubmissionView> = [];

  public utils: Utils = Utils;
  public showSubmissions: boolean = false; // If UX is approved, remove the submissions panel and references to showSubmissions from this screen. For now switch it off.
  public hideNotifications: boolean = true;
  public hideApplicationStatuses: boolean = true;

  constructor(private breakpointObserver: BreakpointObserver,
              public appComponent: AppComponent,
              public userService: UserService,
              public notificationService: NotificationService) { }

  ngOnInit() {
    this.userService.getUserByUserId().subscribe((user: UserView) => {
        this.user = user;
      },
      error => {
        console.error('Failed to retrieve user');
        this.user = null;
      });

    /*
    this.vesselService.getVessels().subscribe(vessels => {
      this.vessels = vessels;
    },
    error => {
      console.error('Failed to retrieve vessels');
      this.vessels = [];
    });

    this.licenceService.getStatusesOfSubmissions().subscribe(submissions => {
      this.submissions = submissions;
    },
    error => {
      console.error('Failed to retrieve submissions');
      this.submissions = [];
    });
    */

    this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      },
      error => {
        console.error('Failed to retrieve notifications');
        this.notifications = [];
      });

  }

  public goToNotificationItem(notification: NotificationView): void {

  }
  public goToSubmissionItem(submission: SubmissionView): void {

  }

}
