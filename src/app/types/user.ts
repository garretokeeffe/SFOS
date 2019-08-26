import {Optional} from '@angular/core';

export class User {
  public id: number;
  public firstName: string;
  public surname: string;
  public userReferenceNumber: string;
  public email: string;
  public lastLoginDate: string;

  constructor(user?: User | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (user) {
      // copy constructor
      this.id = user.id;
      this.firstName = user.firstName;
      this.surname = user.surname;
      this.userReferenceNumber = user.userReferenceNumber;
      this.email = user.email;
      this.lastLoginDate = user.lastLoginDate;
    }
  }

  public set fullName(val: string) { }
  public get fullName(): string {
    return this.firstName + ' ' + this.surname;
  }
}

export class UserView extends User {
  constructor(user?: User | UserView | any) { // DMcD 'any' only supported for unit testing
    super(user);
  }
}
