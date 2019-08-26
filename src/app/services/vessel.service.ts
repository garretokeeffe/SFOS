import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vessel, VesselView } from '../types/vessel';
import {VesselOwnerView} from '../types/vessel-owner';

@Injectable({
  providedIn: 'root'
})
export class VesselService {

  constructor(private http: HttpClient) { }

  public getVessels(ownerId?: number): Observable<Array<VesselView>> {

    const url: string = environment.getVesselsURL;

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
        (res: Array<Vessel>) => {
          let vessels: Array<VesselView> = [];
          res = res ? res : [];
          res.forEach((vessel: Vessel) => {
            vessels.push(new VesselView(vessel));
          });

          if (ownerId) {
            const vesselsFiltered: Array<VesselView> = [];
            vessels.forEach((vessel: VesselView) => {
              vessel.owners.forEach((owner: VesselOwnerView) => {
                if (owner.id === ownerId) {
                  vesselsFiltered.push(vessel);
                }
              });
            });
            vessels = vesselsFiltered;
          }
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
