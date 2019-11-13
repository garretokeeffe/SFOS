import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Keycloak } from 'keycloak-angular/lib/core/services/keycloak.service';
import { UserView } from '../types/user';
import { Capacity, CapacityView } from '../types/capacity';
import {
  LetterOfOfferStatus,
  LicenceApplication,
  LicenceApplicationStatus,
  LicenceApplicationView
} from '../types/licence-application';
import { ProgressPatch } from './licence.service';
import * as moment from 'moment';

/* istanbul ignore next */
@Injectable({
  providedIn: 'root',
})
export class DemoService {

  private urlVersion: string = 'assets/demo/version';
  public packageJsonVersion: string = environment.version;

  public getVersionURL: string = 'assets/demo/version';
  public getKeycloakProfileURL: string = 'assets/demo/keycloakuserprofile';
  public getUserProfileURL: string = 'assets/demo/userprofile';
  public getLicenceApplicationURL: string = 'assets/demo/licence-application';
  public getUsersURL: string = 'assets/demo/users';
  public getApplicationsURL: string = 'assets/demo/applications';
  public getNotificationCategoriesURL: string = 'assets/demo/notification-categories';
  public getNotificationsURL: string = 'assets/demo/notifications';
  public getStatusesOfSubmissionsURL: string = 'assets/demo/statuses-of-submissions';
  public getVesselsURL: string = 'assets/demo/vessels';
  public getVesselURL: string = 'assets/demo/vessel';
  public getLetterOfOfferTermsURL: string = 'assets/demo/letter-of-offer-terms';
  public getSubmissionsAllURL: string = 'assets/demo/submissions-all';
  public getSubmissionsInProgressURL: string = 'assets/demo/submissions-in-progress';
  public getCapacityURL: string = 'assets/demo/capacity';

  constructor(private http: HttpClient) { }

  public getVersion(): Observable<string> {

    const url: string = this.urlVersion;
    return Observable.create((observer) => {
      this.http.get(url, {observe: 'body'})
      .subscribe(
        (res: any) => {
          let version: string = res && res.version ? res.version.replace(/-SNAPSHOT|trunk-/gi, '') + ' ' : '';
          version += this.packageJsonVersion;
          observer.next(version);
          observer.complete();
        },
        (error) => {
          console.log(JSON.stringify(error));
          observer.next('');
        });
    });
  }

  public getKeycloakUserProfile(): Observable<Keycloak.KeycloakProfile> {
    const url: string = this.getKeycloakProfileURL;

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
        (keycloakProfile: Keycloak.KeycloakProfile) => {
          observer.next(keycloakProfile);
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

  public createPreliminaryLicenceApplication(licenceApplication: LicenceApplication | LicenceApplicationView): Observable<LicenceApplicationView> {

    const url: string = this.getLicenceApplicationURL;

    return new Observable((observer) => {
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
        (res: LicenceApplication) => {
          res = res ? new LicenceApplicationView(res) : null;

          // Replace the preliminary information section of the demo response with the inputted values
          if (res) {
            res.preliminaryInformation = licenceApplication.preliminaryInformation;
          }

          observer.next(res);
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

  public progressPreliminaryLicenceApplication(licenceApplication: LicenceApplication | LicenceApplicationView,
                                               payload: ProgressPatch): Observable<LicenceApplicationView> {

    const response: LicenceApplicationView = new LicenceApplicationView(licenceApplication);

    return new Observable((observer) => {
      response.letterOfOffer.acceptedBy = payload.acceptedBy;
      response.letterOfOffer.rejectedBy = payload.rejectedBy;
      if (payload.acceptedBy) {
        response.letterOfOffer.acceptedDate = moment.utc(new Date()).format('DD/MM/YYYY');
        response.letterOfOffer.rejectedDate = null;
        response.letterOfOffer.status = LetterOfOfferStatus['ACCEPTED'];
        response.status = LicenceApplicationStatus['PENDING_COMPLIANCE'];
        response.expiryDate = moment.utc(new Date()).add(1, 'year').format('DD/MM/YYYY');
      } else if (payload.rejectedBy) {
        response.letterOfOffer.acceptedDate = null;
        response.letterOfOffer.rejectedDate = moment.utc(new Date()).format('DD/MM/YYYY');
        response.letterOfOffer.status = LetterOfOfferStatus['REJECTED'];
        response.status = LicenceApplicationStatus['PREVOKED'];
        response.expiryDate = null;
      }
    });
  }
}
