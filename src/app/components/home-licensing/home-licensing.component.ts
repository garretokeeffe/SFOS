import { Component, OnInit } from '@angular/core';
import { Notification } from '../../types/notification';
import { Utils } from '../../services/utils.service';
import { NotificationService } from '../../services/notification.service';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-home-licensing',
  templateUrl: './home-licensing.component.html',
  styleUrls: ['./home-licensing.component.css'],
})
export class HomeLicensingComponent implements OnInit {

  public utils: Utils = Utils;
  public notifications: Array<Notification> = [];
  constructor(public appComponent: AppComponent,
              public notificationService: NotificationService) { }

  public ngOnInit(): void {

    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    },
      (error) => {
      console.error('Failed to retrieve notifications');
      this.notifications = [];
    });
  }

  public goToNotificationItem(notification: Notification): void {

  }

}
