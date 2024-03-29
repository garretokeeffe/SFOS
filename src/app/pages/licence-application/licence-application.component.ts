import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, Optional} from '@angular/core';
import {LicenceApplicationView} from '../../types/licence-application';
import {EmitterService} from '../../services/emitter.service';
import {Emitters} from '../../types/emitters';
import {UserView} from '../../types/user';
import {UserService} from '../../services/user.service';
import {animations} from '../../animations';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Applicant, ApplicantView} from '../../types/applicant';
import {AuthenticationService} from '../../services/authentication.service';
import {UserGroup} from '../../types/ifisauthentication';

@Component({
  selector: 'app-licence-application',
  templateUrl: './licence-application.component.html',
  styleUrls: ['./licence-application.component.css'],
  animations: animations,
})
export class LicenceApplicationComponent implements OnInit, AfterViewChecked {

  public user: UserView = null;
  public licenceApplication: LicenceApplicationView = new LicenceApplicationView();
  public UserGroup: typeof UserGroup = UserGroup;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(public authentication: AuthenticationService,
              @Optional() private cdRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              public userService: UserService) { }

  public ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: UserView) => {
      this.user = user;
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

}
