import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {AuthenticationService} from '../../services/authentication.service';
import {Location} from '@angular/common';
import {AppComponent} from '../../app.component';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-feature-buttons',
  templateUrl: './feature-buttons.component.html',
  styleUrls: ['./feature-buttons.component.css']
})
export class FeatureButtonsComponent implements OnInit {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );
  public isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map(result => result.matches)
  );
  public isAtLeastLarge$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map(result => result.matches)
  );
  public isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
  .pipe(
    map(result => result.matches)
  );
  public isSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map(result => result.matches)
  );
  public isMedium$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
  .pipe(
    map(result => result.matches)
  );
  public isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver) { }

  public ngOnInit(): void {
  }

}
