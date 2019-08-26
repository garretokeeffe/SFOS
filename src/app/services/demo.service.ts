import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

/* istanbul ignore next */
@Injectable({
  providedIn: 'root',
})
export class DemoService {

  private urlVersion: string = 'assets/demo/version';
  public packageJsonVersion: string = environment.version;

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
}
