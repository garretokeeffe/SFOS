import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppComponent} from '../../app.component';
import {EmitterService} from '../../services/emitter.service';
import {Emitters} from '../../types/emitters';
import {Router} from '@angular/router';
import {Globals} from '../../globals';
import { LaWizardMode } from '../../components/licence-application/la-wizard/la-wizard.component';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public LaWizardMode: any = LaWizardMode; // html access to enum

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
  public isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
  .pipe(
    map((result) => result.matches),
  );
  public isSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map((result) => result.matches),
  );
  public isMedium$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
  .pipe(
    map((result) => result.matches),
  );
  public isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
  .pipe(
    map((result) => result.matches),
  );

  constructor(public globals: Globals,
              private breakpointObserver: BreakpointObserver,
              public appComponent: AppComponent,
              public authentication: AuthenticationService,
              private router: Router) { }

  public ngOnInit(): void { }

  public login(): void {
    // EmitterService.get(Emitters[Emitters.LOGIN]).emit(true);
    this.router.navigate(['/login']).then((e) => {});
  }

  public onNewLicenceApplication(): void {
    if (this.globals.demo) {
      this.authentication.demoModeAuthenticated = true;
    }
    this.router.navigate(['/licence-application-wizard', LaWizardMode['NEW']]).then((e) => {});
  }

  public onDownloadForms(): void {
    this.router.navigate(['/forms']).then((e) => {});
  }

  public register(): void {
    const helpUrl: string = 'https://www.agriculture.gov.ie/agfoodiehelpvideos/howtoregisterforagfoodie/';
    const newWindow = window.open(helpUrl, '_howToRegister', 'menubar=no, toolbar=no, location=no, titlebar=no');
    // do not destroy the fileURL before new window has loaded as Chrome 70+ has not yet rendered the pdf view (it works ok in Chrome 56 + 57)
    newWindow.onload = () => {
      newWindow.onunload = () => {
        window.URL.revokeObjectURL(helpUrl);
      };
    };
  }

}
