import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {LetterOfOfferTerm, LicenceApplicationView} from '../../../types/licence-application';
import {EmitterService} from '../../../services/emitter.service';
import {Emitters} from '../../../types/emitters';
import {Utils} from '../../../services/utils.service';
import {Globals} from '../../../globals';
import {LicenceService} from '../../../services/licence.service';
import {animations} from '../../../animations';
import {UserView} from '../../../types/user';
import {ApplicantView, LetterOfOfferTermsAcceptanceStatus} from '../../../types/applicant';
import {InfoDialogComponent} from '../../info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-la-letter-of-offer',
  templateUrl: './la-letter-of-offer.component.html',
  styleUrls: ['./la-letter-of-offer.component.css'],
  animations: animations,
})
export class LaLetterOfOfferComponent implements OnInit, OnChanges {

  @Input() licenceApplication: LicenceApplicationView;
  @Input() isActiveView: boolean;

  @Output() letterOfOfferTermsAccepted = new EventEmitter();
  @Output() refId = new EventEmitter();

  public showingLetterOfOffer: boolean = false;

  public termsAccepted: boolean = false;
  public arn: string = '12345XYZ';

  public utils: Utils = Utils;

  public displayedColumns: Array<string> = ['name', 'numberOfShares', 'acceptance'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              public globals: Globals,
              public licenceService: LicenceService) {
  }

  public ngOnInit(): void {
    // TODO, this block should be removed for proper application development
    if (!this.globals.configuration.letterOfOfferReviewDelay) {
      this.licenceApplication.letterOfOfferIssued = true;
      this.emitUpdate();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isActiveView'].currentValue) {
      this.licenceApplication.refId = this.arn;
      this.emitUpdate();

      setTimeout( () => {
        this.licenceApplication.letterOfOfferIssued = true;
        // TODO: retrieve the 30 days from config
        this.licenceApplication.letterOfOfferTermsDeadlineDate = moment.utc().add(30, 'days').format('DD/MM/YYYY HH:MM');
        this.licenceService.getLetterOfOfferTerms().subscribe( (terms: Array<LetterOfOfferTerm>) => {
          this.licenceApplication.letterOfOfferTerms = terms;
          this.emitUpdate();
        },
        error => {
        console.error('Failed to get Letter Of Offer Terms');
          this.emitUpdate();
        });
        this.emitUpdate();
      }, this.globals.configuration.letterOfOfferReviewDelay);
    }
  }

  public emitUpdate(): void {
    EmitterService.get(Emitters[Emitters.LICENCE_APPLICATION_UPDATE]).emit(this.licenceApplication);
  }

  public popupApplicantInfo(applicant: ApplicantView): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '300px',
      data: applicant.popupInfo()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The applicant info dialog was closed');
    });
  }
}
