import {
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output, QueryList,
  SimpleChanges, ViewChildren,
} from '@angular/core';
import { Applicant, LicenceApplicationView, RegisteredLengthOption } from '../../../types/licence-application';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { animations } from '../../../animations';
import { UserType, UserView } from '../../../types/user';
import { FleetSegmentManager, FleetSubSegment } from '../../../types/fleet-segment';
import { LetterOfOfferStatus, LicenceApplicationStatus } from '../../../types/licence-application';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef, MatCheckbox, MatFormField } from '@angular/material';
import { Utils } from '../../../services/utils.service';
import { LicenceService } from '../../../services/licence.service';
import { NVP } from '../../../types/nvp';
import { UserService } from '../../../services/user.service';

export interface OptionItem {
  value: string;
  viewValue: string;
}
export interface SegmentGroup {
  disabled?: boolean;
  name: string;
  segment: OptionItem[];
}

@Component({
  selector: 'app-la-preliminary-info-simple',
  templateUrl: './la-preliminary-info-simple.component.html',
  styleUrls: ['./la-preliminary-info-simple.component.css'],
  animations: animations,
})
export class LaPreliminaryInfoSimpleComponent implements OnInit, OnChanges {

  public useDoneButtons: boolean = false; // ui/ux configuration option

  @Input() public displayContextHelp: boolean = true;

  @Input() public standAlonePage: boolean = false;
  @Input() public embedded: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public user: UserView = null;
  @Input() public licenceApplication: LicenceApplicationView = new LicenceApplicationView();

  @Output() public back: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public next: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();

  @ViewChildren(MatFormField, { read: ElementRef }) public formFields: QueryList<ElementRef>;

  public form: FormGroup;
  public otherApplicantForms: Array<FormGroup>;
  public errorMessage: string = null;

  public Object: any = Object;
  public RegisteredLengthOption: any = RegisteredLengthOption;
  public FleetSubSegment: any = FleetSubSegment;
  public ApplicantType: any = UserType;
  public LicenceApplicationStatus: any = LicenceApplicationStatus;
  public LetterOfOfferStatus: any = LetterOfOfferStatus;
  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods
  public utils: Utils = Utils;

  // form section statuses
  public lengthCompleted: boolean = false;
  public segmentCompleted: boolean = false;
  public applicantTypeCompleted: boolean = false;
  public primaryApplicantCompleted: boolean = false;
  public companyCompleted: boolean = false;
  public partnershipCompleted: boolean = false;
  public applicantListCompleted: boolean = false;
  public isAuthorised: boolean = false;

  // request status
  public submissionInProgress: boolean = false;

  // TODO: replace this with a method that constructs a dynamic array based on available fleet segments returned from the db
  public segmentGroups: SegmentGroup[] = [];
  public allSegmentGroups: SegmentGroup[] = [
    {
      name: 'Aquaculture',
      segment: [
        {value: '1942701', viewValue: 'Aquaculture'},
      ],
    },
    {
      name: 'Beam Trawler',
      segment: [
        {value: '1942696', viewValue: 'Beam Trawler'},
      ],
    },
    {
      name: 'Polyvalent',
      disabled: false,
      segment: [
        {value: '1942697', viewValue: 'Polyvalent < 18m LOA'},
        {value: '338360921', viewValue: 'Polyvalent >= 18m LOA'},
        {value: '338360917', viewValue: 'Polyvalent Scallops >= 10m LOA'},
      ],
    },
    {
      name: 'RSW Pelagic',
      segment: [
        {value: '1807585', viewValue: 'RSW Pelagic'},
      ],
    },
    {
      name: 'Specific',
      segment: [
        {value: '338360923', viewValue: 'Specific Scallops >= 10m LOA'},
        {value: '1942695', viewValue: 'Specific General'},
      ],
    },
  ];

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
              private licenceService: LicenceService,
              @Optional() public cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {

    this.form = this.fb.group({
      loa: [this.licenceApplication.preliminaryInformation.loa, [Validators.required]],
      registeredLength: [this.licenceApplication.preliminaryInformation.registeredLength, [Validators.required]],
      fleetSegment: [this.licenceApplication.preliminaryInformation.fleetSegment, [Validators.required]],
      applicantType: [this.licenceApplication.preliminaryInformation.applicantType, [Validators.required]],
      companyName: [this.licenceApplication.preliminaryInformation.companyName, []], // TODO add control with validation dynamically
      partnershipName: [this.licenceApplication.preliminaryInformation.partnershipName, []], // TODO add control with validation dynamically
      firstName: [this.licenceApplication.preliminaryInformation.primaryApplicant.firstName, [Validators.required]],
      lastName: [this.licenceApplication.preliminaryInformation.primaryApplicant.lastName, [Validators.required]],
      email: [this.licenceApplication.preliminaryInformation.primaryApplicant.email,
        [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
    });

    // Call after initialising the form
    this.prefillPreliminaryInformationWithUserDetails();

    this.segmentGroups = this.allSegmentGroups;
    this.setupOtherApplicantControls(this.licenceApplication.preliminaryInformation.otherApplicants);
  }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['licenceApplication'] && changes['licenceApplication'].currentValue && !changes['licenceApplication'].firstChange) {
      this.form.controls['fleetSegment'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['fleetSegment']);
      this.form.controls['loa'].setValue((this.readonly ? changes['licenceApplication'].currentValue['preliminaryInformation']['loa'] + '' : changes['licenceApplication'].currentValue['preliminaryInformation']['loa']));
      this.form.controls['registeredLength'].setValue((this.readonly ? changes['licenceApplication'].currentValue['preliminaryInformation']['registeredLength'] + '' : changes['licenceApplication'].currentValue['preliminaryInformation']['registeredLength']));
      this.form.controls['applicantType'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['applicantType']);
      this.form.controls['companyName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['companyName']);
      this.form.controls['partnershipName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['partnershipName']);
      this.form.controls['firstName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['primaryApplicant']['firstName']);
      this.form.controls['lastName'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['primaryApplicant']['lastName']);
      this.form.controls['email'].setValue(changes['licenceApplication'].currentValue['preliminaryInformation']['primaryApplicant']['email']);
      // this.setupOtherApplicantControls(changes['licenceApplication'].currentValue['preliminaryInformation']['otherApplicants']);

      this.prefillPreliminaryInformationWithUserDetails();
    }

    if (changes['user'] && changes['user'].currentValue && !changes['user'].firstChange) {
      this.prefillPreliminaryInformationWithUserDetails();
    }
  }

  public prefillPreliminaryInformationWithUserDetails(): void {
    if (this.user) {
      this.licenceApplication.preliminaryInformation.submittedBy = new Applicant();
      this.licenceApplication.preliminaryInformation.submittedBy.id = this.user.id;
      this.licenceApplication.preliminaryInformation.submittedBy.firstName = this.user.firstName;
      this.licenceApplication.preliminaryInformation.submittedBy.lastName = this.user.lastName;
      this.licenceApplication.preliminaryInformation.submittedBy.email = this.user.email;

      this.licenceApplication.preliminaryInformation.primaryApplicant.id = this.user.id;
      this.licenceApplication.preliminaryInformation.primaryApplicant.firstName = this.user.firstName;
      this.licenceApplication.preliminaryInformation.primaryApplicant.lastName = this.user.lastName;
      this.licenceApplication.preliminaryInformation.primaryApplicant.email = this.user.email;
      this.licenceApplication.preliminaryInformation.companyName = this.user.companyName;
      this.form.controls['firstName'].setValue(this.licenceApplication.preliminaryInformation.primaryApplicant.firstName);
      this.form.controls['lastName'].setValue(this.licenceApplication.preliminaryInformation.primaryApplicant.lastName);
      this.form.controls['email'].setValue(this.licenceApplication.preliminaryInformation.primaryApplicant.email);
      this.form.controls['companyName'].setValue(this.licenceApplication.preliminaryInformation.companyName);
    }
  }

  public configureFleetSegmentGroups(): void {
    // TODO: Refactor this
    if (Number(this.form.controls['loa'].value) < 10) {
      this.segmentGroups = [
        {
          name: 'Aquaculture',
          segment: [
            {value: '1942701', viewValue: 'Aquaculture'},
          ],
        },
        {
          name: 'Beam Trawler',
          segment: [
            {value: '1942696', viewValue: 'Beam Trawler'},
          ],
        },
        {
          name: 'Polyvalent',
          disabled: false,
          segment: [
            {value: '1942697', viewValue: 'Polyvalent < 18m LOA'},
          ],
        },
        {
          name: 'RSW Pelagic',
          segment: [
            {value: '1807585', viewValue: 'RSW Pelagic'},
          ],
        },
        {
          name: 'Specific',
          segment: [
            {value: '1942695', viewValue: 'Specific General'},
          ],
        },
      ];
      if (this.form.controls['fleetSegment'].value === '338360921'    // POLYVALENT_GTE_18M_LOA
        || this.form.controls['fleetSegment'].value === '338360917'     // POLYVALENT_SCALLOPS_GTE_10M_LOA
        || this.form.controls['fleetSegment'].value === '338360923') {  // SPECIFIC_SCALLOPS_GTE_10M_LOA
        this.form.controls['fleetSegment'].setValue(null);
      }
    }
    else if (Number(this.form.controls['loa'].value) >= 18) {
      this.segmentGroups = [
        {
          name: 'Aquaculture',
          segment: [
            {value: '1942701', viewValue: 'Aquaculture'},
          ],
        },
        {
          name: 'Beam Trawler',
          segment: [
            {value: '1942696', viewValue: 'Beam Trawler'},
          ],
        },
        {
          name: 'Polyvalent',
          disabled: false,
          segment: [
            {value: '338360921', viewValue: 'Polyvalent >= 18m LOA'},
            {value: '338360917', viewValue: 'Polyvalent Scallops >= 10m LOA'},
          ],
        },
        {
          name: 'RSW Pelagic',
          segment: [
            {value: '1807585', viewValue: 'RSW Pelagic'},
          ],
        },
        {
          name: 'Specific',
          segment: [
            {value: '338360923', viewValue: 'Specific Scallops >= 10m LOA'},
            {value: '1942695', viewValue: 'Specific General'},
          ],
        },
      ];
      if (this.form.controls['fleetSegment'].value === '1942697') { // POLYVALENT_LT_18M_LOA
        this.form.controls['fleetSegment'].setValue(null);
      }
    } else {
      this.segmentGroups = [
        {
          name: 'Aquaculture',
          segment: [
            {value: '1942701', viewValue: 'Aquaculture'},
          ],
        },
        {
          name: 'Beam Trawler',
          segment: [
            {value: '1942696', viewValue: 'Beam Trawler'},
          ],
        },
        {
          name: 'Polyvalent',
          disabled: false,
          segment: [
            {value: '1942697', viewValue: 'Polyvalent < 18m LOA'},
            {value: '338360917', viewValue: 'Polyvalent Scallops >= 10m LOA'},
          ],
        },
        {
          name: 'RSW Pelagic',
          segment: [
            {value: '1807585', viewValue: 'RSW Pelagic'},
          ],
        },
        {
          name: 'Specific',
          segment: [
            {value: '338360923', viewValue: 'Specific Scallops >= 10m LOA'},
            {value: '1942695', viewValue: 'Specific General'},
          ],
        },
      ];
      if (this.form.controls['fleetSegment'].value === '338360921') { // POLYVALENT_GTE_18M_LOA
        this.form.controls['fleetSegment'].setValue(null);
      }
    }
  }

  public setupOtherApplicantControls(otherApplicants: Array<Applicant>): void {
    this.otherApplicantForms = [];
    otherApplicants.forEach((applicant: Applicant, index: number) => {
      this.otherApplicantForms.push(
        this.fb.group({
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          // email: ['', [Validators.required]],
        }),
      );
      this.otherApplicantForms[index].controls['firstName'].setValue(applicant['firstName']);
      this.otherApplicantForms[index].controls['lastName'].setValue(applicant['lastName']);
      // this.otherApplicantForms[index].controls['email'].setValue(applicant['email']);
    });
  }

  public addApplicant(): void {
    this.applicantListCompleted = false;
    const applicant: Applicant = new Applicant();
    this.licenceApplication.preliminaryInformation.otherApplicants.push(applicant);
    this.otherApplicantForms.push(
      this.fb.group({
        firstName: new FormControl ('', [Validators.required]),
        lastName: new FormControl ('', [Validators.required]),
        // email: new FormControl ('', [Validators.required]),
      }),
    );
    setTimeout(() => {
      /*this.formFields.forEach((formField) => {
        formField.nativeElement.classList.remove('mat-form-field-invalid');
      });*/
      const ffArray: Array<ElementRef> = this.formFields.map<ElementRef>((el) => el); // map queryList to a 1 based array
      for (let i: number = ffArray.length - 0; i--; i > ffArray.length - 3) {
        const field: ElementRef = ffArray[i];
        field.nativeElement.classList.remove('mat-form-field-invalid');
      }

      /*
      const arr: HTMLCollection = document.getElementsByClassName('mat-form-field-subscript-wrapper');
      for (let i = 0; i < arr.length; i++) {
        arr[i].setAttribute('ng-reflect-ng-switch', 'hint');
      }*/

    }, 500);
  }

  public removeApplicant(index: number): void {
    this.licenceApplication.preliminaryInformation.otherApplicants.splice(index, 1);
    this.otherApplicantForms.splice(index, 1);
  }

  public get registeredLengthOptions(): Array<string> {
    const keys: Array<string> = Object.keys(RegisteredLengthOption).filter((key: string) => !isNaN(Number(key)) && Number(key) !== RegisteredLengthOption['UNKNOWN']);
    return keys;
  }
  public get applicantTypes(): Array<string> {
    let keys: Array<string> = Object.keys(UserType).filter((key: string) => !isNaN(Number(key)) && Number(key) !== UserType['NONE']);

    // don't return COMPANY as an option if the logged in user is an INDIVIDUAL and Vice-Versa
    if (this.user.userType === UserType['INDIVIDUAL']) {
      keys = keys.filter((key: string) => Number(key) !== UserType['COMPANY']);
    } else if (this.user.userType === UserType['COMPANY']) {
      keys = keys.filter((key: string) => Number(key) !== UserType['INDIVIDUAL']);
    }
    return keys;
  }

  public ngOnDestroy(): void {
    this.errorMessage = '';
  }

  public isIndividual(): boolean {
    return Number(this.form.controls.applicantType.value) === UserType['INDIVIDUAL'];
  }
  public isCompany(): boolean {
    return Number(this.form.controls.applicantType.value) === UserType['COMPANY'];
  }
  public isPartnership(): boolean {
    return Number(this.form.controls.applicantType.value) === UserType['PARTNERSHIP'];
  }

  public onLoseFocus(section: string): void {
    if (section.toUpperCase() === 'LENGTH') {
      this.lengthCompleted = this.isDone(section);
    } else if (section.toUpperCase() === 'SEGMENT') {
      this.segmentCompleted = this.isDone(section);
    } else if (section.toUpperCase() === 'APPLICANT_TYPE') {
      this.applicantTypeCompleted = this.isDone(section);
    } else if (section.toUpperCase() === 'COMPANY') {
      this.companyCompleted = this.isDone(section);
    } else if (section.toUpperCase() === 'PARTNERSHIP') {
      this.partnershipCompleted = this.isDone(section);
    } else if (section.toUpperCase() === 'PRIMARY_APPLICANT') {
      this.primaryApplicantCompleted = this.isDone(section);
    }
  }

  public isDone(section: string): boolean {
    if (section.toUpperCase() === 'LENGTH') {
      return this.form.controls.loa.value && this.form.controls.registeredLength.value;
    } else if (section.toUpperCase() === 'SEGMENT') {
      return this.form.controls.fleetSegment.value;
    } else if (section.toUpperCase() === 'APPLICANT_TYPE') {
      return this.form.controls.applicantType.value;
    } else if (section.toUpperCase() === 'COMPANY') {
      return this.form.controls.companyName.value;
    } else if (section.toUpperCase() === 'PARTNERSHIP') {
      return this.form.controls.partnershipName.value;
    } else if (section.toUpperCase() === 'PRIMARY_APPLICANT') {
      return this.form.controls.firstName.value && this.form.controls.lastName.value && this.form.controls.email.value;
    }
  }

  public showHelpText(section: string): boolean {
    if (section.toUpperCase() === 'LENGTH') {
      return this.canProceedToFormSection(section)
        && !(this.showHelpText('SEGMENT') || this.showHelpText('APPLICANT_TYPE') || this.showHelpText('COMPANY') || this.showHelpText('PARTNERSHIP') || this.showHelpText('PRIMARY_APPLICANT') || this.showHelpText('SECONDARY_APPLICANTS'));
    } else if (section.toUpperCase() === 'SEGMENT') {
      return this.canProceedToFormSection(section)
        && !(this.showHelpText('APPLICANT_TYPE') || this.showHelpText('COMPANY') || this.showHelpText('PARTNERSHIP') || this.showHelpText('PRIMARY_APPLICANT') || this.showHelpText('SECONDARY_APPLICANTS'));
    } else if (section.toUpperCase() === 'APPLICANT_TYPE') {
      return this.canProceedToFormSection(section)
        && !(this.showHelpText('SECONDARY_APPLICANTS') || this.showHelpText('PRIMARY_APPLICANT') || this.showHelpText('COMPANY') || this.showHelpText('PARTNERSHIP'));
    }  else if (section.toUpperCase() === 'COMPANY') {
      return this.canProceedToFormSection(section)
        && !(this.showHelpText('SECONDARY_APPLICANTS') || this.showHelpText('PRIMARY_APPLICANT') || this.showHelpText('PARTNERSHIP'));
    } else if (section.toUpperCase() === 'PARTNERSHIP') {
      return this.canProceedToFormSection(section)
        && !(this.showHelpText('SECONDARY_APPLICANTS') || this.showHelpText('PRIMARY_APPLICANT') || this.showHelpText('COMPANY'));
    } else if (section.toUpperCase() === 'PRIMARY_APPLICANT') {
      return this.canProceedToFormSection(section) && !this.showHelpText('SECONDARY_APPLICANTS');
    } else if (section.toUpperCase() === 'SECONDARY_APPLICANTS') {
      return this.canProceedToFormSection(section);
    }

    return false;
  }
  public canProceedToFormSection(section: string): boolean {
    if (section.toUpperCase() === 'LENGTH') {
      return !this.readonly;
    } else if (section.toUpperCase() === 'SEGMENT') {
      return !this.readonly && this.lengthCompleted;
    } else if (section.toUpperCase() === 'APPLICANT_TYPE') {
      return !this.readonly && this.lengthCompleted && this.segmentCompleted;
    } else if (section.toUpperCase() === 'COMPANY') {
      return Number(this.form.controls.applicantType.value) === UserType['COMPANY'];
    } else if (section.toUpperCase() === 'PARTNERSHIP') {
      return Number(this.form.controls.applicantType.value) === UserType['PARTNERSHIP'];
    } else if (section.toUpperCase() === 'PRIMARY_APPLICANT') {
      return this.form.controls.applicantType.value ? true : false; // return true if any applicant type is selected
    } else if (section.toUpperCase() === 'SECONDARY_APPLICANTS') {
      return Number(this.form.controls.applicantType.value) === UserType['PARTNERSHIP'];
    }
  }

  /*
  public canProceedToFormSection(section: string): boolean {
    if (section.toUpperCase() === 'LENGTH') {
      return !this.readonly;
    } else if (section.toUpperCase() === 'SEGMENT') {
      return !this.readonly && this.form.controls.loa.value && this.form.controls.registeredLength.value;
    } else if (section.toUpperCase() === 'APPLICANT_TYPE') {
      return !this.readonly && this.form.controls.loa.value && this.form.controls.registeredLength.value && this.form.controls.fleetSegment.value;
    } else if (section.toUpperCase() === 'COMPANY') {
      return !this.readonly && this.form.controls.loa.value && this.form.controls.registeredLength.value && this.form.controls.fleetSegment.value && Number(this.form.controls.applicantType.value) === UserType['COMPANY'];
    } else if (section.toUpperCase() === 'PARTNERSHIP') {
      return !this.readonly && this.form.controls.loa.value && this.form.controls.registeredLength.value && this.form.controls.fleetSegment.value && Number(this.form.controls.applicantType.value) === UserType['PARTNERSHIP'];
    } else if (section.toUpperCase() === 'PRIMARY_APPLICANT') {
      return !this.readonly && this.form.controls.loa.value && this.form.controls.registeredLength.value && this.form.controls.fleetSegment.value
        && (Number(this.form.controls.applicantType.value) === UserType['INDIVIDUAL']
          || (Number(this.form.controls.applicantType.value) === UserType['COMPANY'] && this.form.controls.companyName.value)
          || (Number(this.form.controls.applicantType.value) === UserType['PARTNERSHIP'] && this.form.controls.partnershipName.value));
    } else if (section.toUpperCase() === 'SECONDARY_APPLICANTS') {
      return !this.readonly && this.form.controls.loa.value && this.form.controls.registeredLength.value && this.form.controls.fleetSegment.value
        && (Number(this.form.controls.applicantType.value) === UserType['PARTNERSHIP'] && this.form.controls.partnershipName.value)
        && this.form.controls.firstName.value && this.form.controls.lastName.value && this.form.controls.email.value;
    }

    return false;
  }
  */

  public isFormSectionComplete(section: string): boolean {
    if (section.toUpperCase() === 'LENGTH') {
      return !this.readonly && this.form.controls.loa.value && this.form.controls.registeredLength.value;
    } else if (section.toUpperCase() === 'PRIMARY_APPLICANT') {
      return !this.readonly && this.form.controls.firstName.value && this.form.controls.lastName.value && this.form.controls.email.value;
    } else if (section.toUpperCase() === 'SECONDARY_APPLICANTS') {
      return !this.readonly && this.form.controls.firstName.value && this.form.controls.lastName.value && this.form.controls.email.value;
    }
  }

  public otherApplicantFormsValid(ignoreNumberOfApplicants: boolean = false): boolean {
    let isValid: boolean = true;
    if (this.isPartnership()) {
      // In addition to the primary applicant, there must be at least one other partner
      if (!ignoreNumberOfApplicants && this.otherApplicantForms.length < 1) {
        isValid =  false;
      } else {
        this.otherApplicantForms.forEach((form: FormGroup) => {
          if (form.invalid) {
            isValid = false;
          }
        });
      }
    }
    return isValid;
  }

  public displayRegisteredLengthHint(): string {
    if (Number(this.licenceApplication.preliminaryInformation.registeredLength) === RegisteredLengthOption['GTE_24M']) {
      return '24M OR LONGER';
    } else if (Number(this.licenceApplication.preliminaryInformation.registeredLength) === RegisteredLengthOption['LT_24M']) {
      return 'LESS THAN 24M';
    } else {
      return '';
    }
  }

  // TODO: move this to utils - its a common method
  // method duplicated in la-download-forms and la-retrieve-preliminary_application components
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

  public openVesselLengthBottomSheet(): void {
    this._bottomSheet.open(LaVesselLengthBottomSheet);
  }
  public openFleetSegmentBottomSheet(): void {
    this._bottomSheet.open(LaFleetSegmentBottomSheet);
  }
  public openReviewPreliminaryInfoBottomSheet(preSubmit: boolean = false): void {
    this._bottomSheet.open(LaReviewPreliminaryInfoBottomSheet, { data: {preSubmit: preSubmit}});
  }

  public onSubmit(): void {

    this.submissionInProgress = true;
    this.licenceService.createPreliminaryLicenceApplication(this.licenceApplication).subscribe(
      (response: LicenceApplicationView) => {
        this.submissionInProgress = false;
        this.licenceApplication = response;
        this.next.emit(this.licenceApplication);
      },
      (error) => {
        this.submissionInProgress = false;
      });

    /*
    // For now, retrieve the demo data
    let demoLicenceApplication: LicenceApplicationView = new LicenceApplicationView();
    this.licenceService.getLicenceApplication('12345', '12345').subscribe( (licenceApplication: LicenceApplicationView) => {
      demoLicenceApplication = licenceApplication;
    });


    this.submissionInProgress = true;
    setTimeout(() => {
      this.licenceService.createPreliminaryLicenceApplication(this.licenceApplication).subscribe(
        (licenceApplication: LicenceApplicationView) => {
          this.submissionInProgress = false;
          demoLicenceApplication.preliminaryInformation = licenceApplication.preliminaryInformation;
          this.next.emit(demoLicenceApplication);
        },
        (error) => {
          this.submissionInProgress = false;
        },
      );
    }, 2000);
     */
  }
}

@Component({
  selector: 'app-la-review-preliminary-info-bottomsheet',
  templateUrl: 'la-review-preliminary-info.bottomsheet.html',
})
export class LaReviewPreliminaryInfoBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<LaReviewPreliminaryInfoBottomSheet>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

@Component({
  selector: 'app-la-vessel-length-bottomsheet',
  templateUrl: 'la-vessel-length.bottomsheet.html',
})
export class LaVesselLengthBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<LaVesselLengthBottomSheet>) {}

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

@Component({
  selector: 'app-la-fleet-segment-bottomsheet',
  templateUrl: 'la-fleet-segment.bottomsheet.html',
})
export class LaFleetSegmentBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<LaFleetSegmentBottomSheet>) {}

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
