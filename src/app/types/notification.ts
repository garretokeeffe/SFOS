import {User} from './user';
import {Vessel} from './vessel';

export enum NotificationType {
  INFO = 0,
  RECEIVED = 1,
  PENDING = 2,
  REJECTED = 3,
  MORE_INFO_REQUIRED = 4,
  ISSUED = 5,
  APPROVED = 6,
  COMPLETED = 7,
  ACTION_REQUIRED = 8
}

export class NotificationCategory {
  public id: number; // 1 = Licence, 2 = Vessel, 3 = Authorisations, 4 = General
  public name: string;

  constructor(category?: NotificationCategory | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (category) {
      this.id = category.id;
      this.name = category.name;
    }
  }
}
export class NotificationCategoryView extends NotificationCategory {
  constructor(category?: NotificationCategory | NotificationCategoryView | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    super(category);
  }
}

export class Notification {
  public id: number; // notification id - used to mark as read
  public categoryId: number;
  public applicationId: number;
  public date: string;
  public vesselId: number;
  public vesselName: string;
  public type: number; // corresponding to NotificationType;
  public title: string;
  public text: string;
  public actionRequiredText: string;
  public readByUser: boolean = false;
  public readByRepresentative: boolean = false;

  constructor(notification?: Notification | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (notification) {
      // copy constructor
      this.id = notification.id;
      this.categoryId = notification.categoryId;
      this.applicationId = notification.applicationId;
      this.date = notification.date;
      this.vesselId = notification.vesselId;
      this.vesselName = notification.vesselName;
      this.type = notification.type;
      this.title = notification.title;
      this.text = notification.text;
      this.actionRequiredText = notification.actionRequiredText;
      this.readByUser = notification.readByUser;
      this.readByRepresentative = notification.readByRepresentative;
    }
  }
}

export class NotificationView extends Notification {
  public icon: string = 'notifications';
  constructor(notification?: Notification | NotificationView | any) { // DMcD 'any' only supported for unit testing
    super(notification);

    switch (notification.type) {
      case NotificationType['ACTION_REQUIRED']:
        this.icon = 'priority_high';
        break;
    }
  }

  public toString(): string {
    let s: string = '';
    s += this.date;
    s += this.vesselName;
    s += this.text;
    s += this.actionRequiredText;

    return s;
  }
}
