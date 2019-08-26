import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { map, max} from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { UserView } from 'src/app/types/user';
import { AuthenticationService } from '../../services/authentication.service';
import { Utils } from '../../services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public utils = Utils; // .getInstance(); // provide access to static Utils functions in html
  public profileDetails: UserView = new UserView();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  title$: Observable<object>;

  constructor(public authentication: AuthenticationService,
              public activatedRoute: ActivatedRoute,
              private breakpointObserver: BreakpointObserver,
              private snackBar: MatSnackBar,
              private userService: UserService) { }

  public ngOnInit(): void {
    this.title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));
    this.getUserProfile();
  }

  private getUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (data: UserView) => {
        this.profileDetails = new UserView(data);
      },
      (error) => {
        console.error('Error in getting profile data ' + error);
      },
    );
  }

  public dynamicWidth(value: string, placeHolder: string = value): string {
    return Utils.dynamicWidth(value, placeHolder);
  }

  public onEdit(): void {
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

}
