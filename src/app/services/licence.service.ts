import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { Globals } from '../globals';
import {
  Applicant,
  LetterOfOfferStatus,
  LetterOfOfferTerm,
  LicenceApplication, LicenceApplicationStatus,
  LicenceApplicationSummary, LicenceApplicationSummaryView, LicenceApplicationView,
} from '../types/licence-application';
import {Submission, SubmissionView} from '../types/submission';
import {Vessel, VesselView} from '../types/vessel';
import { DemoService } from './demo.service';

export interface ProgressPatch {
  acceptedBy: Applicant;
  rejectedBy: Applicant;
}

@Injectable({
  providedIn: 'root',
})
export class LicenceService {

  constructor(private http: HttpClient,
              private globals: Globals,
              @Optional() private demoService: DemoService) {  }

  public createPreliminaryLicenceApplication(licenceApplication: LicenceApplication | LicenceApplicationView): Observable<LicenceApplicationView> {

    if (this.globals.demo) {
      return this.demoService.createPreliminaryLicenceApplication(licenceApplication);
    }
    else {
      const url: string = environment.createPreliminaryLicenceApplicationURL;

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0', // Proxies
        }),
      };

      return new Observable((observer) => {
        this.http.post<LicenceApplication>(url, licenceApplication.preliminaryInformation, httpOptions)
        .subscribe(
          (response) => {
            observer.next(new LicenceApplicationView(response)); // response contains the licence application with appended data
            observer.complete();

          },
          (error) => {
            console.log(JSON.stringify(error));
            observer.error(error);
            observer.complete();
          });
      });
    }
  }

  public progressPreliminaryLicenceApplication( userId: string,
                                                licenceApplication: LicenceApplication | LicenceApplicationView,
                                                moveToStatus: number,
                                                applicant: Applicant): Observable<LicenceApplicationView | boolean> {

    const payload: ProgressPatch = {
      acceptedBy: null,
      rejectedBy: null,
    };

    let action: string = '';

    switch (moveToStatus) {
      case LicenceApplicationStatus['PENDING_COMPLIANCE']:
        payload.acceptedBy = applicant;
        action = 'accept';
        break;
      case LicenceApplicationStatus['WITHDRAWN']:
        payload.rejectedBy = applicant;
        action = 'reject;';
        break;
      default:
        console.error('Attempt to progress the preliminary application to an invalid status (', moveToStatus, ') aborted');
        return new Observable((observer) => {
          observer.error(false);
          observer.complete();
        });
    }

    // TODO remove the true below - for now always return demo data
    if (this.globals.demo) {
      return this.demoService.progressPreliminaryLicenceApplication(licenceApplication, payload);
    }
    else {
      // To accept the terms
      // http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications/accept/ccs/{ccsUserId}/arn/{arn}

      let url: string = environment.progressPreliminaryLicenceApplicationURL;
      url += '/' + action;
      url += '/users/ccs/' + userId;
      url += '/' + licenceApplication.arn;

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0', // Proxies
        }),
      };

      return new Observable((observer) => {
        this.http.put<LicenceApplication>(url, payload, httpOptions)
        .subscribe(
          (response) => {
            observer.next(new LicenceApplicationView(response)); // response contains the licence application with amended data
            observer.complete();

          },
          (error) => {
            console.log(JSON.stringify(error));
            observer.error(error);
            observer.complete();
          });
      });
    }
  }

  public getActiveLicenceApplicationSummaries(userId?: string): Observable<Array<LicenceApplicationSummaryView>> {
    return this.getLicenceApplicationSummaries(true, userId);
  }

  public getInactiveLicenceApplicationSummaries(userId?: string): Observable<Array<LicenceApplicationSummaryView>> {
    return this.getLicenceApplicationSummaries(false, userId);
  }

  private getLicenceApplicationSummaries(active: boolean = true, userId?: string): Observable<Array<LicenceApplicationSummaryView>> {
    // userId = CCS Id from keycloak profile

    const url: string = this.globals.demo ? this.demoService.getActiveLicenceApplicationSummariesURL
      : active ? environment.getActiveLicenceApplicationSummariesURL + '/' + userId
      : environment.getInactiveLicenceApplicationSummariesURL + '/' + userId;

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
        (res: Array<LicenceApplicationSummary>) => {
          const licenceApplicationSummaries: Array<LicenceApplicationSummary> = [];
          res = res && res['content'] ? res['content'] : [];
          res.forEach((licenceApplicationSummary: LicenceApplicationSummary) => {
            licenceApplicationSummaries.push(new LicenceApplicationSummaryView(licenceApplicationSummary));
          });
          observer.next(licenceApplicationSummaries);
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

  public getLicenceApplication(userId?: string, arn?: string, pin?: string): Observable<LicenceApplicationView> {

    // userId = CCS Id from keycloak profile
    // sample userId for hard-coding = VA100131F

    let url: string = '';

    if (this.globals.demo) {
      url = this.demoService.getLicenceApplicationURL;
    } else {
      url = environment.getLicenceApplicationURL;
      if (userId) {
        url += '/' + userId;

        if (arn) {
          url += '/' + arn;
        }
        if (pin) {
          url += '/' + pin;
        }
      }
    }

    // TODO: remove this hardcoded url (on Stephen's PC) after testing
    // url = 'http://WKEBNFS26938:8080/sfos/preliminary-licence-applications/users/ccs/300/315061143/4274';
    // url = 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/preliminary-licence-applications/users/ccs/300/315062099/9923';
    // url = 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/preliminary-licence-applications/users/ccs/300/315062099/9923';
    // url = 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications/users/ccs/300/315062099/9923';

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

  public deleteLicenceApplication(userId: string, arn: string): Observable<boolean> {

    if (this.globals.demo) {
      return this.demoService.deleteLicenceApplication(userId, arn);
    } else {
      const url: string = environment.deleteLicenceApplicationURL + '/' + arn + '/inactive/Y';

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0', // Proxies
        }),
      };

      return new Observable((observer) => {
        this.http.put<boolean>(url, httpOptions)
        .subscribe(
          (response) => {
            observer.next(response); // response contains the licence application with amended data
            observer.complete();

          },
          (error) => {
            console.log(JSON.stringify(error));
            observer.error(error);
            observer.complete();
          });
      });
    }
  }

  public getStatusesOfSubmissions(applicantId?: string): Observable<Array<SubmissionView>> {

    let url: string = environment.getStatusesOfSubmissionsURL;
    if (applicantId) {
      url += '/' + applicantId;
    }

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
        (res: Array<Submission>) => {
          let submissions: Array<SubmissionView> = [];
          res = res ? res : [];
          res.forEach((submission: Submission) => {
            submissions.push(new SubmissionView(submission));
          });

          if (applicantId) {
            const filteredSubmissions: Array<SubmissionView> = [];
            submissions.forEach((submission: SubmissionView) => {
              const matched: number = submission.applicants.filter((applicant) => applicant.id === applicantId).length;
              if (matched) {
                filteredSubmissions.push(submission);
              }
            });
            submissions = filteredSubmissions;
          }
          observer.next(submissions);
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

  public getSubmissions(loadAllSubmissions: boolean = false): Observable<Array<SubmissionView>> {

    const url: string = loadAllSubmissions ? environment.getSubmissionsAllURL  : environment.getSubmissionsInProgressURL;

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
        (res: Array<Submission>) => {
          const submissions: Array<SubmissionView> = [];
          res = res ? res : [];
          res.forEach((submission: Submission) => {
            submissions.push(new SubmissionView(submission));
          });

          observer.next(submissions);
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
