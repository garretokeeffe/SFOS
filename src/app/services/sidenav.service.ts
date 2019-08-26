import { Injectable } from '@angular/core';
import {MatDrawerToggleResult, MatSidenav} from '@angular/material';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav: MatSidenav;

  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
    // this.sidenav.openedChange.subscribe((isOpen: boolean) => {
    //    console.log(`IsOpen: ${isOpen}`);
    //    this.isOpen = isOpen;
    // });
  }

  public isOpen(): Observable<boolean> {
    return new Observable((observer) => {
      this.sidenav.openedChange.subscribe((isOpen: boolean) => {
        console.log(`IsOpen: ${isOpen}`);
        observer.next(isOpen);
        // observer.complete(); // DMcD: IMPORTANT - Do not complete this observable as the subscription must remain open for parent subscription to react to sidenav changes
      });
    });
  }

  public open(): Promise<MatDrawerToggleResult> {
    return this.sidenav.open();
  }

  public close(): Promise<MatDrawerToggleResult> {
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }
}
