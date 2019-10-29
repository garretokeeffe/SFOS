import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {LetterOfOfferTerm, LicenceApplicationView} from '../../../types/licence-application';
import {EmitterService} from '../../../services/emitter.service';
import {Emitters} from '../../../types/emitters';
import {MovingDirection, WizardComponent} from 'angular-archwizard';
import {LaPreliminaryInfoComponent0} from '../la-preliminary-info0/la-preliminary-info-component0.component';
import * as moment from 'moment';
import {UserView} from '../../../types/user';
import {ApplicantView, LetterOfOfferTermsAcceptanceStatus} from '../../../types/applicant';
import {InfoDialogComponent} from '../../info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';
import {ConfirmationInfo} from '../../../types/dialog-info';
import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-la-navbar',
  templateUrl: './la-navbar.component.html',
  styleUrls: ['./la-navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LaNavbarComponent implements OnInit, OnChanges {

  @Input() public licenceApplication: LicenceApplicationView = new LicenceApplicationView();
  @Input() public user: UserView = new UserView();

  @Output() public refId: any = new EventEmitter();

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public currentStepIndex: number = 0;

  public advancingToLetterOfOffer: boolean = false;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog) { }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['userprofile'] && changes['userprofile'].currentValue) {
      this.licenceApplication.setActiveApplicant(changes['userprofile'].currentValue.userReferenceNumber);
    }
  }

  public setActiveView(component: any, direction: MovingDirection): void {
    // this.advancingToLetterOfOffer = direction === MovingDirection.Forwards
    //  && (this.licenceApplication.refId && component.wizard.model.currentStepIndex === 0
    //  || !this.licenceApplication.refId && component.wizard.model.currentStepIndex === 1);

    this.advancingToLetterOfOffer = direction === MovingDirection.Forwards && component.wizard.model.currentStepIndex === 1;
  }

  public setLetterOfOfferTermsAcceptedDate(): void {
    this.licenceApplication.activeApplicant.letterOfOfferTermsAcceptedDate = moment.utc().format('DD/MM/YYYY HH:MM'); // new Date().toString('dd/mm/yyyy hh:mm');
  }

  public confirmLetterOfOfferTermsRejection(): void {
    let text: string = 'This action will withdraw the licence application';
    if (this.licenceApplication.applicants.length > 1) {
      text += ' for all applicants.';
    } else {
      text += '.';
    }
    const confirmationInfo: ConfirmationInfo = new ConfirmationInfo('Reject Terms', text);

    const dialogRef: any = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: confirmationInfo
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Confirmation result: ${result}`);
      if (result) {
        // userprofile confirmed rejection
        this.licenceApplication.activeApplicant.letterOfOfferTermsAcceptanceStatus = LetterOfOfferTermsAcceptanceStatus['REJECTED'];
        this.licenceApplication.activeApplicant.letterOfOfferTermsRejectedDate = moment.utc().format('DD/MM/YYYY HH:MM'); // new Date().toString('dd/mm/yyyy hh:mm');
      }
    });

  }

}
