import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Application, ApplicationView } from '../types/application';
import { User, UserView } from '../types/user';
import { Globals } from '../globals';
import { Keycloak } from 'keycloak-angular/lib/core/services/keycloak.service';
import { DemoService } from './demo.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private currentUserProfile: UserView = null;

  constructor(private globals: Globals,
              private http: HttpClient,
              protected keycloakService: KeycloakService,
              private demoService: DemoService) { }

  public logout(): void {
    this.currentUserProfile = null;
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
    if (this.currentUserProfile) {
      return Observable.create((observer) => {
        observer.next(this.currentUserProfile);
        observer.complete();
      });
    }

    if (this.globals.demo) {
      return Observable.create((observer) => {
        this.demoService.getKeycloakUserProfile()
        .subscribe(
          (profile: Keycloak.KeycloakProfile) => {
            // simulate getting the remaining user attributes from ifis
            this.getUserProfileByCcsId(profile.id).subscribe((user: UserView) => {
              observer.next(user);
              observer.complete();
            });
          },
        );
      });
    } else {
      return Observable.create((observer) => {
        if (this.isUsingKeycloak()) {
          this.keycloakService.loadUserProfile()
          .then(
            (profile: Keycloak.KeycloakProfile) => {
              // get the remaining user attributes from ifis
              this.getUserProfileByCcsId(profile.id).subscribe((user: UserView) => {
                observer.next(user);
                observer.complete();
              });
            },
          );
        } else {
          console.log('Attempted to getUserProfile() without keycloak authentication');
          observer.next(new UserView()); // return an empty userprofile object
          observer.complete();
        }
      });
    }
  }

  private getUserProfileByCcsId(ccsId: string): Observable<UserView> {
    console.log('getUserProfileByCcsId: ' + ccsId);
    let url: string = this.globals.demo ? this.demoService.getUserProfileURL : environment.getUserProfileURL;

    // don't append the ccsId in demo mode
    if (!this.globals.demo && ccsId) {
      url += '/' + ccsId;
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

          // override any attributes values returned by ifis with those persisted in CCS
          // user.setKeycloakAttributes(keycloakProfile); // remove this line if all user attributes are returned from ifis

          this.currentUserProfile = user;
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

  public getUserByUserId(userId?: number): Observable<UserView> {
    console.log('getUserByUserId:' + userId);
    // let url: string = environment.getUserProfileURL;
    let url: string = this.globals.demo ? this.demoService.getUserProfileURL : environment.getUserProfileURL;
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
    const url: string = environment.getUsersURL;

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
            user = new UserView(users[0]);
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
