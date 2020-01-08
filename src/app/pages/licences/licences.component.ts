import { Component, DoCheck, OnInit, Output } from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {AppComponent} from '../../app.component';
import {UserService} from '../../services/user.service';
import {VesselView} from '../../types/vessel';
import {NotificationView} from '../../types/notification';
import {SubmissionView} from '../../types/submission';
import {UserView} from '../../types/user';
import {Utils} from '../../services/utils.service';
import {ActivatedRoute} from '@angular/router';
import { animations } from '../../animations';
import { LaWizardMode } from '../../components/licence-application/la-wizard/la-wizard.component';

@Component({
  selector: 'app-licences',
  templateUrl: './licences.component.html',
  styleUrls: ['./licences.component.css'],
  animations: animations,
})
export class LicencesComponent implements OnInit, DoCheck {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastLarge$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );

  public title$: Observable<object> = this.title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));

  public user: UserView = null;
  public vessels: Array<VesselView> = [];
  public notifications: Array<NotificationView> = [];
  public submissions: Array<SubmissionView> = [];
  public LaWizardMode: any = LaWizardMode; // html access to enum

  public utils: Utils = Utils;

  constructor(public activatedRoute: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              public appComponent: AppComponent,
              public userService: UserService) { }

  public ngOnInit(): void {

    // title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));

    this.userService.getCurrentUser().subscribe((user) => {
        this.user = user;
      },
      (error) => {
        console.error('Failed to retrieve user profile');
        this.user = null;
      },
    );

  }

  public ngDoCheck(): void {

  }
}
