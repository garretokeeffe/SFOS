import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Vessel, VesselView} from '../types/vessel';
import {environment} from '../../environments/environment';
import {Submission, SubmissionView} from '../types/submission';
import {LetterOfOfferTerm} from '../types/licence-application';
import {Applicant} from '../types/applicant';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  constructor(private http: HttpClient) { }

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

  public getLetterOfOfferTerms(licenceApplicationRefNo?: string): Observable<Array<LetterOfOfferTerm>> {

    let url: string = environment.getLetterOfOfferTermsURL;
    if (licenceApplicationRefNo) {
      url += '/' + licenceApplicationRefNo;
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
        (res: Array<LetterOfOfferTerm>) => {
          res = res ? res : [];
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
