import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Application, ApplicationView } from '../types/application';
import { User, UserView } from '../types/user';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private _userProfile: UserView;

  constructor(private globals: Globals, private http: HttpClient, protected keycloakService: KeycloakService) { }

  public get userProfile(): UserView {
    if (this._userProfile) {
      return this._userProfile;
    } else {
      console.log('getUserProfile() must be called first');
      this.getUserProfile().subscribe( _ => {});
      setTimeout(() => {
        return this._userProfile;
      },         2000); // wait 2 seconds to allow user profile to be fetched from server. TODO: fix this implementation
    }
  }

  public set userProfile(userProfile: UserView) {
    this._userProfile = userProfile;
  }

  public isUsingKeycloak(): boolean {
    try {
      const roles: Array<string> = this.keycloakService.getUserRoles();
      return roles.length > 0 ? true : false;
    }
    catch (err) {
      return false;
    }
  }

  public getUserProfile(): Observable<UserView> {
    if (this.globals.demo) {
      return this.getUserByUserId();
    } else {
      return Observable.create((observer) => {
        if (this.isUsingKeycloak()) {
          this.keycloakService.loadUserProfile()
          .then(
            (profile) => {
              const user: UserView = new UserView();
              user.firstName = profile.firstName;
              user.surname = profile.lastName;
              user.email = profile.email;
              // user.ppsn = '2222222';
              this.userProfile = user;
              observer.next(user);
              observer.complete();
            },
            (error) => {
              // logger.error(JSON.stringify(error));
              console.log(JSON.stringify(error));
              observer.error(error);
              observer.complete();
            },
          );
        } else {
          console.log('Attempted to getUserProfile() without keycloak authentication');
          observer.next(new UserView()); // return an empty user object
          observer.complete();
        }
      });
    }
  }

  public getUserByUserId(userId?: number): Observable<UserView> {
    console.log('getUserByUserId:' + userId);
    let url: string = environment.getUserURL;
    if (userId) {
      url += '/' + userId;
    }

    return Observable.create((observer) => {
      this.http.get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0', // Proxies
        }),
        observe: 'body',
      })
      .subscribe(
        (res: User) => {
          const user: UserView = new UserView(res);

          observer.next(user);
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

  public getUserByUserReferenceNumber(userReferenceNumber?: string): Observable<UserView> {
    console.log('getUserByUserReferenceNumber');
    let url: string = environment.getUsersURL;

    // if (userReferenceNumber) {
    //   url += '/' + userReferenceNumber;
    // }

    return Observable.create((observer) => {
      this.http.get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0',  // Proxies
        }),
        observe: 'body',
      })
      .subscribe(
        (users: Array<User>) => {

          let user: UserView = null;

          users = users.filter((el) => el.userReferenceNumber === userReferenceNumber);
          if (users) {
            user = users[0];
          }

          observer.next(user);
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

  public getApplications(userId?: string): Observable<Array<ApplicationView>> {

    let url: string = environment.getApplicationsURL;
    if (userId) {
      url += '/' + userId;
    }

    return Observable.create((observer) => {
      this.http.get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0', // Proxies
        }),
        observe: 'body',
      })
      .subscribe(
        (res: Array<Application>) => {
          res = res ? res : [];

          if (res.length === 0) {
            observer.next(res);
            observer.complete();
          } else {
            const applications: Array<ApplicationView> = [];

            // get notifications for the application
            res.forEach((application: Application) => {
              applications.push(new ApplicationView(application));
              if (applications.length === res.length) {
                observer.next(applications);
                observer.complete();
              }
            });
          }
        },
        (error) => {
          console.error(JSON.stringify(error));
          observer.error(error);
          observer.complete();
        });
    });
  }
}
