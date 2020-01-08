import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vessel, VesselView } from '../types/vessel';
import { VesselOwnerView } from '../types/vessel-owner';
import { Globals } from '../globals';
import { DemoService } from './demo.service';

@Injectable({
  providedIn: 'root'
})
export class VesselService {

  constructor(private http: HttpClient,
              private globals: Globals,
              @Optional() private demoService: DemoService) { }

  public getVessels(ownerId?: string): Observable<Array<VesselView>> {

    // ownerId = CCS Id from keycloak profile
    // sample ownerId for hard-coding = VA100131F

    const url: string = this.globals.demo ? this.demoService.getVesselsURL : environment.getVesselsURL + '/' + ownerId;

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
        (res: Array<Vessel>) => {
          const vessels: Array<VesselView> = [];
          res = res ? res : [];
          res.forEach((vessel: Vessel) => {
            vessels.push(new VesselView(vessel));
          });

          /*
          if (this.globals.demo && ownerId) {
            const vesselsFiltered: Array<VesselView> = [];
            vessels.forEach((vessel: VesselView) => {
              vessel.owners.forEach((owner: VesselOwnerView) => {
                if (owner.id === parseInt(ownerId)) {
                  vesselsFiltered.push(vessel);
                }
              });
            });
            vessels = vesselsFiltered;
          }
          */

          observer.next(vessels);
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

  public getVessel(cfr?: string): Observable<VesselView> {

    const url: string = environment.getVesselsURL;

    // WIP The above should be const url: string = environment.getVesselURL;
    // for now just use the first vessel returned from list

    return new Observable(observer => {
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
        (res: Array<Vessel>) => {
          const vessels: Array<VesselView> = [];
          res = res ? res : [];
          res.forEach((vessel: Vessel) => {
            vessels.push(new VesselView(vessel));
          });

          observer.next(vessels[0]);
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
