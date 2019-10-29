import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges
} from '@angular/core';
import { ApplicantType, LetterOfOfferTerm, LicenceApplicationView } from '../../../types/licence-application';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animations } from '../../../animations';
import { UserView } from '../../../types/user';
import { FleetSegmentManager, FleetSubSegment } from '../../../types/fleet-segment';
import { LetterOfOfferStatus } from '../../../types/licence-application';
import { GlossaryVesselIdentifiersBottomSheet } from '../../vessel/vessel.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-la-preliminary-info',
  templateUrl: './la-preliminary-info.component.html',
  styleUrls: ['./la-preliminary-info.component.css'],
  animations: animations
})
export class LaPreliminaryInfoComponent implements OnInit, OnChanges {

  public displayHelpText: boolean = false;

  @Input() public standAlonePage: boolean = false;
  @Input() public embedded: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public user: UserView = null;
  @Input() public licenceApplication: LicenceApplicationView = new LicenceApplicationView();

  @Output() public back: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public next: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();

  public form: FormGroup;
  public errorMessage: string = null;

  public FleetSubSegment: any = FleetSubSegment;
  public ApplicantType: any = ApplicantType;
  public LetterOfOfferStatus: any = LetterOfOfferStatus;
  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods

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
              private _bottomSheet: MatBottomSheet,
              @Optional() public cdRef: ChangeDetectorRef) {
    this.form = fb.group({
      fleetSegment: ['', [Validators.required]],
      loa: ['', [Validators.required]],
      registeredLength: ['', [Validators.required]],
      applicantType: ['', [Validators.required]],
      partnershipName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  public ngOnInit(): void {
  }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['licenceApplication'] && changes['licenceApplication'].currentValue) {
      this.form.controls['fleetSegment'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['fleetSegment']);
      this.form.controls['loa'].setValue((this.readonly ? changes['licenceApplication'].currentValue['preliminaryInformation']['loa'] + 'm' : changes['licenceApplication'].currentValue['preliminaryInformation']['loa']));
      this.form.controls['registeredLength'].setValue((this.readonly ? changes['licenceApplication'].currentValue['preliminaryInformation']['registeredLength'] + 'm' : changes['licenceApplication'].currentValue['preliminaryInformation']['registeredLength']));
      this.form.controls['applicantType'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['applicantType']);
      this.form.controls['partnershipName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['partnershipName']);
      this.form.controls['companyName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['companyName']);
      this.form.controls['firstName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['primaryApplicant']['firstName']);
      this.form.controls['lastName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['primaryApplicant']['lastName']);
      this.form.controls['email'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['primaryApplicant']['email']);
    }
  }

  public ngOnDestroy(): void {
    this.errorMessage = '';
  }

  public openBottomSheet(): void {
    this._bottomSheet.open(LaPreliminaryInfoBottomSheet);
  }
}

@Component({
  selector: 'app-la-preliminary-info-bottom-cheet',
  templateUrl: 'la-preliminary-info.bottomsheet.html',
})
export class LaPreliminaryInfoBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<LaPreliminaryInfoBottomSheet>) {}

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

