import { Injectable, Optional } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Vessel, VesselView} from '../types/vessel';
import {environment} from '../../environments/environment';
import { AllCapacity, AllCapacityView, Capacity, CapacityView } from '../types/capacity';
import { Globals } from '../globals';
import { DemoService } from './demo.service';

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

  constructor(private http: HttpClient,
              private globals: Globals,
              @Optional() private demoService: DemoService) { }

  public getAllCapacity(ownerId?: string): Observable<AllCapacityView> {

    // ownerId = CCS Id from keycloak profile
    // sample ownerId for hard-coding = VA100131F

    const url: string = this.globals.demo ? this.demoService.getCapacityURL : environment.getCapacityURL + '/' + ownerId;

    return Observable.create( (observer) => {
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
        (res: AllCapacity) => {
          if (res) {
            const onRegisterCapacities: Array<CapacityView> = [];
            res.onRegister.forEach((capacity: Capacity) => {
              onRegisterCapacities.push(new CapacityView(capacity));
            });
            res.onRegister = onRegisterCapacities;

            const offRegisterCapacities: Array<CapacityView> = [];
            res.offRegister.forEach((capacity: Capacity) => {
              offRegisterCapacities.push(new CapacityView(capacity));
            });
            res.offRegister = offRegisterCapacities;
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

  // TODO: method below may be removed when getAllCapacity() is implemented
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
