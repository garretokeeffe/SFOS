import { Component, OnInit} from '@angular/core';
import { NotificationView} from '../../types/notification';
import { UserService } from '../../services/user.service';
import { Utils } from '../../services/utils.service';
import { UserView } from '../../types/user';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { SubmissionView } from '../../types/submission';
import { NotificationService } from '../../services/notification.service';
import { Globals } from '../../globals';

@Component({
  selector: 'app-home-vessel-owner',
  templateUrl: './home-vessel-owner.component.html',
  styleUrls: ['./home-vessel-owner.component.css'],
})
export class HomeVesselOwnerComponent implements OnInit {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  public user: UserView = null;
  public notifications: Array<NotificationView> = [];
  public submissions: Array<SubmissionView> = [];

  public utils: Utils = Utils;
  public showSubmissions: boolean = false; // If UX is approved, remove the submissions panel and references to showSubmissions from this screen. For now switch it off.
  public hideNotifications: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver,
              public appComponent: AppComponent,
              public globals: Globals,
              public userService: UserService,
              public notificationService: NotificationService) { }

  public ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: UserView) => {
      this.user = user;
    },
      (error) => {
      console.error('Failed to retrieve user profile');
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

    /*
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    },
    error => {
      console.error('Failed to retrieve notifications');
      this.notifications = [];
    });
    */
  }

  public goToNotificationItem(notification: NotificationView): void {

  }
  public goToSubmissionItem(submission: SubmissionView): void {

  }


}
