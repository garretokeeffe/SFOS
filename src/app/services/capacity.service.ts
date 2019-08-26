import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Vessel, VesselView} from '../types/vessel';
import {environment} from '../../environments/environment';
import {Capacity, CapacityView} from '../types/capacity';

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

  constructor(private http: HttpClient) { }

  public getCapacities(ownerId?: number): Observable<Array<CapacityView>> {

    const url: string = environment.getCapacityURL;

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
        (res: Array<Capacity>) => {
          let capacities: Array<CapacityView> = [];
          res = res ? res : [];
          res.forEach((capacity: Capacity) => {
            capacities.push(new CapacityView(capacity));
          });

          if (ownerId) {
            capacities = capacities.filter(el => el.ownerId === ownerId);
          }
          observer.next(capacities);
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
