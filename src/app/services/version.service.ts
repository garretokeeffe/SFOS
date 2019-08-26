import { Injectable, Optional} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { DemoService } from './demo.service';
import { Globals } from '../globals';

@Injectable()
export class VersionService {

  public packageJsonVersion: string = environment.version;

  constructor(public http: HttpClient,
              public globals: Globals,
              @Optional() public demoService: DemoService) { }

  public getVersion(): Observable<string> {

    if (this.globals.demo && this.demoService) {
      return this.demoService.getVersion();
    } else {
      const url: string = environment.getVersionURL;

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
          (res: any) => {
            if (!res) {
              console.log('System version not available. Returning version from package.json instead.');
            }
            const version: string = res && res.version ? res.version.replace(/-SNAPSHOT|trunk-/gi, '') : this.packageJsonVersion;
            observer.next(version);
            observer.complete();

          },
          (error) => {
            // logger.error(JSON.stringify(error));
            console.log(JSON.stringify(error));
            console.log('System version not available. Returning version from package.json instead.');
            observer.next(this.packageJsonVersion);
            observer.complete();
          });
      });
    }
  }

  /*
  public getVersionFromPropertiesFile(): Observable<string> {
    const url: string = 'assets/version.properties';
    return Observable.create(observer => {
      this.http.get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/text',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
          'Pragma': 'no-cache', // HTTP 1.0
          'Expires': '0' // Proxies
        }),
        observe: 'body',
        responseType: 'text'
      })
      .subscribe(
        (res: any) => {
          console.log(res);
          observer.next(res);
          observer.complete();
        },
        (error) => {
          console.log(JSON.stringify(error));
          observer.error(error);
          observer.complete();
        });
    });
  }
  */

}
