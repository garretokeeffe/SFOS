import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import {
  Applicant,
  LetterOfOfferStatus,
  LetterOfOfferTerm,
  LicenceApplicationView,
} from '../../../types/licence-application';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LicenceService } from '../../../services/licence.service';
import { Observable } from 'rxjs';
import { ConfirmationInfo } from '../../../types/dialog-info';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { map } from 'rxjs/operators';
import { animations } from '../../../animations';
import { UserView } from '../../../types/user';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-la-letter-of-offer',
  templateUrl: './la-letter-of-offer.component.html',
  styleUrls: ['./la-letter-of-offer.component.css'],
  animations: animations,
})
export class LaLetterOfOfferComponent implements OnInit, OnDestroy {

  public enableDisplayOfPreliminaryInformation: boolean = false; // Configuration Option

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
  public showPreliminaryInformation: boolean = false;
  public termsAccepted: boolean = false;

  public LetterOfOfferStatus: any = LetterOfOfferStatus;

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
              @Optional() public cdRef: ChangeDetectorRef,
              private licenceService: LicenceService) {  }

  public ngOnInit(): void { }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.errorMessage = '';
  }

  public acceptLetterOfOffer(): void {

    // TODO: http post - the response will contain the LicenceApplication.expiryDate
    // simulate for now
    this.licenceApplication.letterOfOffer.status = LetterOfOfferStatus['ACCEPTED'];
    this.licenceApplication.letterOfOffer.acceptedBy = new Applicant(this.user); // populates ccs id
    this.licenceApplication.letterOfOffer.acceptedDate = moment.utc(new Date()).format('DD/MM/YYYY');
    this.licenceApplication.expiryDate = moment.utc(new Date()).add(1, 'year').format('DD/MM/YYYY');

    this.snackBar.open(`Licence Application (ARN: ${this.licenceApplication.arn}) has been activated`, null, {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'snackBarConfig',
    });

    this.submit.emit(this.licenceApplication);
  }

  public rejectLetterOfOffer(): void {
    this.confirmRejection().subscribe((confirmation) => {
      if (confirmation) {
        this.snackBar.open(`Licence Application (ARN: ${this.licenceApplication.arn}) has been rejected`, null, {
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
      const prompt: string = `The Letter of Offer for this application will be revoked and you will have to re-apply for a licence.`;

      const confirmationInfo: ConfirmationInfo = new ConfirmationInfo('Confirm Rejection', text, prompt, 'OK', 'CANCEL');

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

}
