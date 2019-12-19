import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit, Optional, SimpleChanges, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {NavigationEnd, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { Globals } from '../globals';
import {AuthenticationService} from '../services/authentication.service';
import {EmitterService} from '../services/emitter.service';
import { LicenceService } from '../services/licence.service';
import {SidenavService} from '../services/sidenav.service';
import {UserService} from '../services/user.service';
import {ApplicationID, ApplicationView} from '../types/application';
import {Emitters} from '../types/emitters';
import {UserGroup} from '../types/ifisauthentication';
import {LetterOfOfferTerm, LicenceApplicationView} from '../types/licence-application';
import {UserView} from '../types/user';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() public login: boolean = false;
  @Input() public authenticated: boolean = false;
  @Input() public beforeinstallprompt: any; // window:beforeinstallprompt event
  @ViewChild('drawer') public drawer: MatSidenav;

  public environmentName: string = environment.name;

  private loggingIn: boolean = false;

  private deferredPrompt: any;
  public showA2HSButton: boolean = false;

  public user: UserView = null;
  public applications: Array<ApplicationView> = [];
  public applicationID: any = ApplicationID;

  public manuallyClosed: boolean = false;

  public UserGroup: typeof UserGroup = UserGroup;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );

  public salesNotesURL: string; // = 'http://salesnotesportal-fisheries-dev.apps.rhos.agriculture.gov.ie/';

  constructor(private router: Router,
              public globals: Globals,
              public breakpointObserver: BreakpointObserver,
              public authentication: AuthenticationService,
              public userService: UserService,
              public appComponent: AppComponent,
              private sidenavService: SidenavService,
              @Optional() public cdRef: ChangeDetectorRef) {

    // the following pipe closes the menu after clicking on an action item
    router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd),
    ).subscribe((_) => this.drawer ? this.drawer.close() : null );

  }

  public ngOnInit(): void {

    this.salesNotesURL = environment.salesNotesURL;

    this.sidenavService.setSidenav(this.drawer);

    this.getUserProfile();

    EmitterService.get(Emitters[Emitters.RETURN_TO_DASHBOARD]).subscribe((returnToDashboard: boolean) => {
      console.log('calling navigateToDashboard() following emitter request');
      this.navigateToDashboard();
    });

    console.log('calling navigateToDashboard() following in main-nav ngOnInit()');
    this.navigateToDashboard();
  }

  public isHomeOrLoginPage(): boolean {
    let ret: boolean = true; // need to default this to true otherwise the LHS slide out menu will briefly appear on mobile
    const currentRoot: string = this.router.routerState.snapshot.url;
    // console.log('Current route: ' + currentRoot);

    switch (currentRoot) {
      case '/home':
        ret = true;
        break;
      case '/login':
        ret = true;
        break;
      default:
        ret = false;
    }

    return ret;
  }

  public getUserProfile(): void {
    this.userService.getUserProfile().subscribe((user: UserView) => {
      this.user = user;

      this.userService.getApplications().subscribe(
        (applications) => {

          // ensure applications are ordered by id (rather than the time it takes to retrieve their notifications)
          this.applications = applications.sort((lhs, rhs): number => {
            if (lhs.id < rhs.id) {
              return -1;
            } else if (lhs.id > rhs.id) {
              return 1;
            } else {
              return 0;
            }
          });

          // EmitterService.get(Emitters[Emitters.RETURN_TO_DASHBOARD]).emit(true);
          // this.router.navigate(['/home-vessel-owner']).then( (e) => { });
        },
        (error) => {
          console.error('Failed to retrieve applications for userprofile');

          this.router.navigate(['/noaccess']).then( (e) => {
            if (e) {
              console.log('Rendering the no-access page');
            } else {
              console.error('Failed to render the no-access page');
            }
          });
        },
      );
    },
    (error) => {
      console.error('Failed to retrieve user profile');
      this.user = null;
    });
  }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['beforeinstallprompt'] && changes['beforeinstallprompt'].currentValue) {
      console.log('beforeinstallprompt received in main-nav');
      this.deferredPrompt = changes['beforeinstallprompt'].currentValue;
      this.showA2HSButton = true;
    }

    if (changes['authenticated'] && changes['authenticated'].previousValue === false && changes['authenticated'].currentValue === true) {
      console.log('MAIN-NAV AUTHENTICATION CHANGED, NAVIGATING TO DASHBOARD - IS THIS OK?');
      this.navigateToDashboard();
    }
  }

  public navigateToDashboard(): void {

    if (this.globals.demo && !this.authentication.demoModeAuthenticated) {
      if (this.globals.demoSkipLoginScreen) {
        this.authentication.demoModeAuthenticated = true;
        this.router.navigate(['/home-vessel-owner']).then((e) => {});
      } else {
        this.router.navigate(['/home']).then((e) => { });
      }
    }
    else {
      if (this.authentication.access.userGroup === UserGroup['FISHERMAN']) {
        this.router.navigate(['/home-vessel-owner']).then((e) => { });
      } else if (this.authentication.access.userGroup === UserGroup['LA']) {
        this.router.navigate(['/lahome']).then((e) => { });
      } else if (this.authentication.access.userGroup === UserGroup['LA2']) {
        this.router.navigate(['/la2home']).then((e) => { });
      } else if (this.authentication.access.userGroup === UserGroup['REPRESENTATIVE']) {
        this.router.navigate(['/rephome']).then((e) => { });
      } else if (this.authentication.access.userGroup === UserGroup['FISH_BUYER']) {
        this.router.navigate(['/fishbuyerhome']).then((e) => { });
      } else if (this.authentication.access.userGroup === UserGroup['SFPA']) {
        this.router.navigate(['/sfpahome']).then((e) => { });
      } else if (this.authentication.access.userGroup === UserGroup['SFPMD']) {
        this.router.navigate(['/sfpmdhome']).then((e) => { });
      } else {
        if (this.globals.demo) {
          this.router.navigate(['/login']).then((e) => {});
        } else {
          console.log('CANNOT ROUTE TO DASHBOARD - INVALID USER GROUP');
          this.router.navigate(['/home']).then((e) => {});
        }
      }
    }
  }

  public addToHomeScreen(): void {
    // hide our userprofile interface that shows our A2HS button
    this.showA2HSButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the userprofile to respond to the prompt
    this.deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }

  public logout(): void {
    this.authentication.doLogout();
    // EmitterService.get(Emitters[Emitters.AUTHENTICATED]).emit(false);
    this.router.navigate(['/home']).then((e) => {});
  }

  // This method was designed for the demo, it may be removed if applications list is dynamic based on userprofile role in the demo
  public canDisplayApplication(application: ApplicationView): boolean {
    if (application.name === 'Licensing') {
      // My Vessels, My Capacity, My Applications will be displayed at top level instead
      return ![UserGroup['FISHERMAN'], UserGroup['FISHERMAN_RO']].includes(this.authentication.access.userGroup);
    } else if (application.name === 'Authorisations') {
      return !([UserGroup['LA2']].includes(this.authentication.access.userGroup));
    } else if (application.name === 'Log Sheets') {
      return ([UserGroup['SFPA']].includes(this.authentication.access.userGroup)); // 'FISHERMAN', 'FISHERMAN_RO',
    } else if (application.name === 'Vessel Tracking') {
      return ([UserGroup['SFPA']].includes(this.authentication.access.userGroup));
    }
    return true;
  }

  public isLicensingApplication(): boolean {
    return this.applications.filter((application: ApplicationView) => application.id === ApplicationID['LICENSING']).length > 0;
  }

}
