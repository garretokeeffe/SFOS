import { Injectable, Optional } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Vessel, VesselView} from '../types/vessel';
import {environment} from '../../environments/environment';
import {Submission, SubmissionView} from '../types/submission';
import {
  LetterOfOfferStatus,
  LetterOfOfferTerm,
  LicenceApplication,
  LicenceApplicationView,
  Applicant,
} from '../types/licence-application';
import { Globals } from '../globals';
import { DemoService } from './demo.service';

export interface ProgressPatch {
  acceptedBy: Applicant;
  rejectedBy: Applicant;
}

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  constructor(private http: HttpClient,
              private globals: Globals,
              @Optional() private demoService: DemoService)
  {

  }

  public createPreliminaryLicenceApplication(licenceApplication: LicenceApplication | LicenceApplicationView): Observable<LicenceApplicationView> {

    if (this.globals.demo) {
      return this.demoService.createPreliminaryLicenceApplication(licenceApplication);
    }
    else {
      const url: string = environment.submitPreliminaryLicenceApplicationURL;

      const httpOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0', // Proxies
        }),
      };

      return new Observable((observer) => {
        this.http.post<LicenceApplication>(url, licenceApplication, httpOptions)
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

  public progressPreliminaryLicenceApplication( licenceApplication: LicenceApplication | LicenceApplicationView,
                                                moveToStatus: number,
                                                applicant: Applicant): Observable<LicenceApplicationView | boolean> {

    const payload: ProgressPatch = {
      acceptedBy: null,
      rejectedBy: null,
    };

    let action: string = '';

    switch (moveToStatus) {
      case LetterOfOfferStatus['ACCEPTED']:
        payload.acceptedBy = applicant;
        action = 'accept';
        break;
      case LetterOfOfferStatus['REJECTED']:
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
    if (true || this.globals.demo) {
      return this.demoService.progressPreliminaryLicenceApplication(licenceApplication, payload);
    }
    else {
      let url: string = environment.progressPreliminaryLicenceApplicationURL;
      url += '/' + action;
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
        this.http.patch<LicenceApplication>(url, payload, httpOptions)
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

  public getLicenceApplication(userId?: string, arn?: string, pin?: string): Observable<LicenceApplicationView> {

    // ownerId = CCS Id from keycloak profile
    // sample ownerId for hard-coding = VA100131F

    let url: string = '';

    // TODO remove the true below - for now always return demo data
    if (true || this.globals.demo) {
      url = this.demoService.getLicenceApplicationURL;
    } else {
      url = environment.getLicenceApplicationURL;
      if (userId) {
        url += '/' + userId;
      }
      if (arn) {
        url += '/' + arn;
      }
      if (pin) {
        url += '/' + pin;
      }
    }

    // TODO: remove this hardcoded url (on Stepehen's PC) after testing
    // url = 'http://WKEBNFS26938:8080/sfos/preliminary-licence-applications/users/ccs/300/315061143/4274';

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

  public getStatusesOfSubmissions(applicantId?: string): Observable<Array<SubmissionView>> {

    let url: string = environment.getStatusesOfSubmissionsURL;
    if (applicantId) {
      url += '/' + applicantId;
    }

    return Observable.create((observer) => {
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

    return Observable.create((observer) => {
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
