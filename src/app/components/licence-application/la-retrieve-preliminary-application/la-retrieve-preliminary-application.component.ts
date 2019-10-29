import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { animations } from '../../../animations';
import { SubmissionView } from '../../../types/submission';
import { ConfirmationInfo } from '../../../types/dialog-info';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LetterOfOfferTerm, LicenceApplicationView } from '../../../types/licence-application';
import { LicenceService } from '../../../services/licence.service';
import { UserView } from '../../../types/user';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-la-retrieve-preliminary-application',
  templateUrl: './la-retrieve-preliminary-application.component.html',
  styleUrls: ['./la-retrieve-preliminary-application.component.css'],
  animations: animations,
})
export class LaRetrievePreliminaryApplicationComponent implements OnInit, OnDestroy {

  @Input() public standAlonePage: boolean = false;
  @Input() public user: UserView = null;
  @Input() public licenceApplication: LicenceApplicationView = new LicenceApplicationView();

  @Input() public letterOfOfferIssued: boolean = false;
  @Output() public next: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public back: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public cancelRetrieveLetterOfOffer: EventEmitter<boolean> = new EventEmitter<boolean>();

  public form: FormGroup;
  public errorMessage: string = null;

  public letterOfOfferTerms: Array<LetterOfOfferTerm> = [];

  public letterOfOfferIssued_showPreliminaryInfo: boolean = true;
  public showingLetterOfOffer: boolean = false;
  public showingLetterOfOfferCompressed: boolean = true;
  public termsAccepted: boolean = false;

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
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private licenceService: LicenceService,
              private globals: Globals) {
    this.form = fb.group({
      arn: ['', [Validators.required, Validators.pattern(/[0-9]+/g)]],
      pin: ['', [Validators.required, Validators.pattern(/[0-9]+/g)]],
    });
  }

  public ngOnInit(): void { }

  public ngOnDestroy(): void {
    this.errorMessage = '';
  }

  public emitCancel(): void {
    this.errorMessage = '';
    this.cancelRetrieveLetterOfOffer.emit(true);
  }

  public getApplication(): void {
    this.errorMessage = '';

    // This condition is for DEMO only
    if (this.globals.demo && (this.form.controls.arn.value === '999' || this.form.controls.pin.value === '999')) {
      this.errorMessage = 'No Match Found';
      this.scroll('bottomOfPage');
    } else {
      this.licenceService.getApplication(this.form.controls.arn.value, this.form.controls.pin.value).subscribe( (licenceApplication: LicenceApplicationView) => {
        this.licenceApplication = licenceApplication;
        this.letterOfOfferTerms = this.licenceApplication.letterOfOffer.terms;
        // this.letterOfOfferIssued = true;

        // TODO populate licenceApplication

        this.next.emit(this.licenceApplication);
      });
    }
  }

  public acceptLetterOfOffer(): void {

  }

  public rejectLetterOfOffer(): void {
    this.confirmRejection().subscribe((confirmation) => {
      if (confirmation) {
        this.snackBar.open('The application has been rejected', null, {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'snackBarConfig',
        });
        this.emitCancel(); // navigate back to My Applications List
      }
    });
  }

  public confirmRejection(): Observable<boolean> {
    return new Observable((observer) => {

      const text: string = `Application Reference Number <div class="br bold">${this.form.controls.arn.value}</div>`;
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

  // TODO: move this to utils - its a common method
  // method duplicated in la-download-forms component
  public scroll(id: string): void {
    const el: HTMLElement = document.getElementById(id);
    if (el) {
      // It is necessary to have a short delay before making the scroll to give
      // the error component enough time to fade into (be rendered) on the screen
      setTimeout(() => {
        el.scrollIntoView({behavior: 'smooth'});
      }, 50);
    }
  }

}
