import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {NotificationCategory, NotificationCategoryView, NotificationView} from '../types/notification';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  public getNotificationCategories(userId?: number): Observable<Array<NotificationCategoryView>> {
    let url: string = environment.getNotificationCategoriesURL;
    if (userId) {
      url += '/' + userId;
    }

    return Observable.create(observer => {
      this.http.get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0' // Proxies
        }),
        observe: 'body'
      })
      .subscribe(
        (res: Array<NotificationCategoryView>) => {
          const categories: Array<NotificationCategoryView> = [];
          res = res ? res : [];
          res.forEach((category: NotificationCategory) => {
            categories.push(new NotificationCategoryView(category));
          });

          // if (userId) {
          //   notifications = notifications.filter(el => el.applicationId === userId);
          // }
          observer.next(categories);
          observer.complete();

        },
        (error) => {
          // logger.error(JSON.stringify(error));
          console.log(JSON.stringify(error));
          observer.error(error);
          observer.complete();
        });
    });
  }

  public getNotifications(userId?: number): Observable<Array<NotificationView>> {

    let url: string = environment.getNotificationsURL;
    if (userId) {
      url += '/' + userId;
    }

    return Observable.create(observer => {
      this.http.get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0' // Proxies
        }),
        observe: 'body'
      })
      .subscribe(
        (res: Array<Notification>) => {
          const notifications: Array<NotificationView> = [];
          res = res ? res : [];
          res.forEach((notification: Notification) => {
            notifications.push(new NotificationView(notification));
          });

          // if (userId) {
          //   notifications = notifications.filter(el => el.applicationId === userId);
          // }
          observer.next(notifications);
          observer.complete();

        },
        (error) => {
          // logger.error(JSON.stringify(error));
          console.log(JSON.stringify(error));
          observer.error(error);
          observer.complete();
        });
    });
  }
}
