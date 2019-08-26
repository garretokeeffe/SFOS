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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );
  isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map(result => result.matches)
  );
  isAtLeastLarge$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map(result => result.matches)
  );
  isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
  .pipe(
    map(result => result.matches)
  );
  isSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map(result => result.matches)
  );
  isMedium$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
  .pipe(
    map(result => result.matches)
  );
  isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
  .pipe(
    map(result => result.matches)
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
      panelClass: 'snackBarConfig'
    });
  }

  public onLogin(): void {
    this.loginFailed = (this.username.value.toLowerCase() === 'bad' || this.password.value.toLowerCase() === 'bad');

    if (!this.loginFailed) {
      this.authenticationService.demoModeAuthenticated = true;
      this.router.navigate(['/home-vessel-owner']).then((e) => {});

      // EmitterService.get(Emitters[Emitters.LOGIN]).emit(false);
      // EmitterService.get(Emitters[Emitters.AUTHENTICATED]).emit(true);
    }
  }

  public onCancel(): void {
    // EmitterService.get(Emitters[Emitters.LOGIN]).emit(false);
    // this.location.back();
    this.router.navigate(['/home']).then((e) => { });
  }

}
