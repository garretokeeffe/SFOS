import { Injectable, Optional } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Vessel, VesselView} from '../types/vessel';
import {environment} from '../../environments/environment';
import {Submission, SubmissionView} from '../types/submission';
import { LetterOfOfferTerm, LicenceApplication, LicenceApplicationView } from '../types/licence-application';
import {Applicant} from '../types/applicant';
import { Globals } from '../globals';
import { DemoService } from './demo.service';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  constructor(private http: HttpClient,
              private globals: Globals,
              @Optional() private demoService: DemoService) { }

  public getApplication(ownerId?: string, arn?: string, pin?: string): Observable<LicenceApplicationView> {

    // ownerId = CCS Id from keycloak profile
    // sample ownerId for hard-coding = VA100131F

    let url: string = '';

    if (this.globals.demo) {
      url = this.demoService.getApplicationURL;
    } else {
      url = environment.getApplicationURL;
      if (ownerId) {
        url += '/' + ownerId;
      }
      if (arn) {
        url += '/' + arn;
      }
      if (pin) {
        url += '/' + pin;
      }
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
