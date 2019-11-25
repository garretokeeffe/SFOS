import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators} from '@angular/forms';
import { EmitterService } from '../../services/emitter.service';
import { Emitters} from '../../types/emitters';
import { AppComponent} from '../../app.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthenticationService } from '../../services/authentication.service';
import { IFISAuthentication } from '../../types/ifisauthentication';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { UrlObject } from "url";
import { environment } from '../../../environments/environment';
import * as urlParse from 'url-parse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
})
export class LoginComponent implements OnInit {

  public mainLogoOrientation: string = 'vertical';

  public hidePassword: boolean = true;
  public loginFailed: boolean = false;

  public username = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);

  public errorMessage: string = 'Invalid username or password.';

  public access: IFISAuthentication = new IFISAuthentication();

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

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private location: Location,
              private breakpointObserver: BreakpointObserver,
              public appComponent: AppComponent,
              private snackBar: MatSnackBar) { }

  public ngOnInit(): void { }

  // convenience getter for easy access to form fields
  // get f() { return this.loginForm.controls; }

  public onRegister(): void {
    this.showRedirectMessage();
  }

  public onForgottenPassword(): void {
    this.showRedirectMessage();
  }

  private showRedirectMessage(): void {
    this.snackBar.open('You are being re-directed to CCS', null, {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'snackBarConfig',
    });
  }

  public onLogin(): void {
    this.loginFailed = true;

    if (this.username.value.toLowerCase() === 'demo' && (this.password.value.toLowerCase() === 'dunmoreeast' || this.password.value.toLowerCase() === 'dunmore east')) {
      this.loginFailed = false;
    }

    if (!this.loginFailed) {
      this.authenticationService.demoModeAuthenticated = true;
      this.router.navigate(['/home-vessel-owner']).then((e) => {});
    }
  }

  public onCancel_DemoLoginPage(): void {
    this.router.navigate(['/home']).then((e) => { });
  }

  public onCancel(): void {

    let newURL: string = '';

    let oldURL: UrlObject = urlParse(document.referrer, true);
    if (!oldURL) {
      oldURL = urlParse(window.top.location, true);
    }
    if (oldURL.protocol) {
      newURL = oldURL.protocol + '//';
    }
    newURL += oldURL.hostname;
    if (oldURL.port) {
      newURL = newURL + ':' + oldURL.port;
    }
    newURL += '/home';

    console.log('Redirecting to ' + newURL);
    // window.top.location.href = newURL; // user can hit back button
    window.top.location.replace(newURL); // takes url out of the browser history so user cant hit back button
  }

}
