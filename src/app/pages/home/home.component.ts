import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppComponent} from '../../app.component';
import {EmitterService} from '../../services/emitter.service';
import {Emitters} from '../../types/emitters';
import {Router} from '@angular/router';
import {Globals} from '../../globals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
              private router: Router) { }

  public ngOnInit(): void { }

  public login(): void {
    // EmitterService.get(Emitters[Emitters.LOGIN]).emit(true);
    this.router.navigate(['/login']).then((e) => {});
  }

  public newLicenceApplication(): void {
    this.router.navigate(['/newlicenceapplication']).then((e) => {});
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
