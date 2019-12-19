import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import {
  Applicant,
  LetterOfOfferStatus,
  LetterOfOfferTerm,
  LicenceApplicationView,
} from '../../../types/licence-application';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef, MatDialog, MatSnackBar } from '@angular/material';
import { LicenceService } from '../../../services/licence.service';
import { Observable } from 'rxjs';
import { ConfirmationInfo } from '../../../types/dialog-info';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { map } from 'rxjs/operators';
import { animations } from '../../../animations';
import { UserType, UserView } from '../../../types/user';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {
  LaFleetSegmentBottomSheet,
  LaVesselLengthBottomSheet,
} from '../la-preliminary-info-simple/la-preliminary-info-simple.component';
import { FleetSegmentManager } from '../../../types/fleet-segment';
import { Utils } from '../../../services/utils.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-la-letter-of-offer',
  templateUrl: './la-letter-of-offer.component.html',
  styleUrls: ['./la-letter-of-offer.component.css'],
  animations: animations,
})
export class LaLetterOfOfferComponent implements OnInit, OnDestroy {

  public enableDisplayOfPreliminaryInformation: boolean = false; // Configuration Option
  public showPreliminaryInformation: boolean = false;
  public showLetterOfOffer: boolean = false;

  public userLoggedIn: boolean = true; // TODO, replace this with code which checks if the user is logged in or not

  @Input() public continueApplicationFlow: boolean = false; // true = continue live application, false = retrieve with pin or select from my applications list
  @Input() public standAlonePage: boolean = false;
  @Input() public user: UserView = null;
  @Input() public licenceApplication: LicenceApplicationView = new LicenceApplicationView();

  @Output() public back: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public submit: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public reject: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public next: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();

  public form: FormGroup;
  public errorMessage: string = null;

  public showTerms: boolean = false;
  public termsAccepted: boolean = false;

  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods
  public LetterOfOfferStatus: any = LetterOfOfferStatus;
  public ApplicantType: any = UserType;
  public utils: Utils = Utils;

  // request status
  public submissionInProgress: boolean = false;

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

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private _bottomSheet: MatBottomSheet,
              @Optional() public cdRef: ChangeDetectorRef,
              private userService: UserService,
              private licenceService: LicenceService) {
  }

  public ngOnInit(): void {
    // If user details have not been passed in, retrieve them now.
    if (!this.user) {
      this.userService.getUserProfile().subscribe((user: UserView) => {
        this.user = user;
      });
    }
  }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.errorMessage = '';
  }

  public acceptLetterOfOffer(): void {
    this.errorMessage = '';
    this.progressPreliminaryLicenceApplication(LetterOfOfferStatus['ACCEPTED']).subscribe(
      (success: boolean) => {
        this.snackBar.open(`Licence Application (ARN: ${this.licenceApplication.arn}) has been accepted`, null, {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'snackBarConfig',
        });

        this.submit.emit(this.licenceApplication);
      },
      (error) => {
        this.errorMessage = 'Sorry, something went wrong. We could not process your request at this time';
      },
    );
  }

  public rejectLetterOfOffer(): void {
    this.confirmRejection().subscribe((confirmation) => {
      if (confirmation) {
        this.snackBar.open(`Licence Application (ARN: ${this.licenceApplication.arn}) has been withdrawn`, null, {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'snackBarConfig',
        });
        // TODO this.reject.emit(this.licenceApplication);
        this.router.navigate(['/licences']).then((e) => { }); // navigate back to My Applications List
      }
    });
  }

  public confirmRejection(): Observable<boolean> {
    return new Observable((observer) => {

      const text: string = `Application Reference Number <div class="br bold">${this.licenceApplication.arn}</div>`;
      const prompt: string = `The Letter of Offer for this application will be withdrawn and you will have to re-apply for a licence.`;

      const confirmationInfo: ConfirmationInfo = new ConfirmationInfo('Confirm Withdraw', text, prompt, 'OK', 'CANCEL');

      const dialogRef: any = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: confirmationInfo,
      });

      dialogRef.afterClosed().subscribe((result) => {
        observer.next(result ? true : false);
        observer.complete();
      });

    });
  }

  public progressPreliminaryLicenceApplication(moveToStatus: number): Observable<boolean> {

    const applicant: Applicant = new Applicant(this.user);

    return new Observable((observer) => {
      this.licenceService.progressPreliminaryLicenceApplication(this.licenceApplication, moveToStatus, applicant).subscribe(
        (response: LicenceApplicationView) => {
          this.submissionInProgress = false;
          this.licenceApplication = response;
          observer.next(true);
          observer.complete();
          this.next.emit(this.licenceApplication);
        },
        (error) => {
          this.submissionInProgress = false;
          observer.error(false);
          observer.complete();
        },
      );
    });
  }

  public login(): void {

  }

  public openVesselLengthBottomSheet(): void {
    this._bottomSheet.open(LaVesselLengthBottomSheet);
  }
  public openFleetSegmentBottomSheet(): void {
    this._bottomSheet.open(LaFleetSegmentBottomSheet);
  }
  public openActivateApplicationBottomSheet(): void {
    this._bottomSheet.open(LaActivateApplicationBottomSheet);
  }
}

@Component({
  selector: 'app-la-activate-application-bottomsheet',
  templateUrl: 'la-activate-application.bottomsheet.html',
})
export class LaActivateApplicationBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<LaActivateApplicationBottomSheet>) {}

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
