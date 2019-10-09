import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MatTable, MatTableDataSource} from '@angular/material';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {animations} from '../../../animations';
import {UserService} from '../../../services/user.service';
import {Applicant, ApplicantView} from '../../../types/applicant';
import {LicenceApplicationView} from '../../../types/licence-application';
import {UserView} from '../../../types/user';
import {InfoDialogComponent} from '../../info-dialog/info-dialog.component';

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
  selector: 'app-la-application',
  templateUrl: './la-application.component.html',
  styleUrls: ['./la-application.component.css'],
  animations,
})

export class LaApplicationComponent implements OnInit, AfterViewChecked {
  @Output() letterOfOfferTermsAccepted = new EventEmitter();
  @Input() public licenceApplication: LicenceApplicationView;
  @ViewChild(MatTable) public applicantTable: MatTable<ApplicantView>;

  public dataSource: MatTableDataSource<ApplicantView>; // DMcD: public for testing
  public displayedColumns: Array<string> = ['name', 'numberOfShares', 'commands'];

  selected : any;
  public user : UserView;
  public loaValue : number;
  public registeredLengthValue : number;

  private _informationAgreed: boolean = false;
  public get isInformationAgreed(): boolean {
    return this._informationAgreed;
  }
  public set informationAgreed(value: boolean) {
    this._informationAgreed = value;
  }

  firstNameFormControl = new FormControl('');
  lastNameFormControl = new FormControl('');
  companyNameFormControl = new FormControl('');
  emailFormControl = new FormControl('', [Validators.required,Validators.email]);

  segmentControl = new FormControl();
  public segmentGroups: SegmentGroup[] = [ //TODO this will be fetched as reference data from the db
    {
      name: 'RSW Pelagic',
      segment: [
        {value: 'rsw-pelagic', viewValue: 'RSW Pelagic'},
      ],
    },
    {
      name: 'Beam Trawler',
      segment: [
        {value: 'beam-trawler', viewValue: 'Beam Trawler'},
      ],
    },
    {
      name: 'Polyvalent',
      disabled: false,
      segment: [
        {value: 'polyvalent-lt-18', viewValue: 'Polyvalent < 18m LOA'},
        {value: 'polyvalent-gte-18', viewValue: 'Polyvalent >= 18m LOA'},
        {value: 'polyvalent-scallops', viewValue: 'Polyvalent Scallops'},
      ],
    },
    {
      name: 'Specific',
      segment: [
        {value: 'specific-scallops-gte-10', viewValue: 'Specific Scallops >= 10m LOA'},
        {value: 'specific-general', viewValue: 'Specific General'},
      ],
    },
  ];
  loaControl = new FormControl();
  registeredLengthControl = new FormControl();

  public applicantTypeControl = new FormControl(); // ToDO this to be queried from Db as reference data
  public applicantTypes: OptionItem[] = [
    {value: 'individual', viewValue: 'Individual'},
    {value: 'partnership', viewValue: 'Partnership'},
    {value: 'company', viewValue: 'Company'},
  ];


  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              public userService: UserService) { }

  ngOnInit() {
    // this.dataSource.data = this.licenceApplication.applicants;
    this.user = new UserView();
    this.licenceApplication.applicants.forEach((applicant: ApplicantView) => {
      console.log(applicant.fullName);
    });
  }

  ngAfterViewChecked() {
    // *ngIf="this.licenceApplication.applicants.length > 0"
    // this.applicantTable.renderRows(); //causes console error
  }

  get readonly(): boolean {
    if (this.licenceApplication.refId) {
      return true;
    } else {
      return false;
    }
  }

  public countSharesAllocated(): number {
    let count: number = 0;
    this.licenceApplication.applicants.forEach( (applicant: ApplicantView) => {
      if (applicant.numberOfShares) {
        count += applicant.numberOfShares;
      }
    });
    return count;
  }

  public addApplicant(): void {
    this.licenceApplication.applicants.push(new ApplicantView());
    this.applicantTable.renderRows();
  }

  public findApplicant(userRefNo: string, index: number): void {
    this.userService.getUserByUserReferenceNumber(userRefNo).subscribe((user: UserView) => {
        if (user) {
          // this.licenceApplication.applicants[index] = new ApplicantView(userprofile);
          this.licenceApplication.applicants[index].id = user.id;
          this.licenceApplication.applicants[index].userReferenceNumber = user.userReferenceNumber;
          this.licenceApplication.applicants[index].firstName = user.firstName;
          this.licenceApplication.applicants[index].lastName = user.lastName;
          this.licenceApplication.applicants[index].email = user.email;
          this.licenceApplication.applicants[index].numberOfShares = 0;
          this.licenceApplication.applicants[index].notFound = false;

          this.applicantTable.renderRows();
        } else {
          this.licenceApplication.applicants[index].notFound = true;
        }
      },
      (error) => {
        console.error('Failed to retrieve userprofile by userprofile ref no');
        this.licenceApplication.applicants[index].notFound = true;
      });
  }

  public deleteApplicant(index: number): void {
    this.licenceApplication.applicants.splice(index, 1);
    this.applicantTable.renderRows();
  }

  public openApplicantDetails(applicant: ApplicantView): void {
  }

  public popupApplicantInfo(applicant: ApplicantView): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '300px',
      data: applicant.popupInfo(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The applicant info dialog was closed');
    });
  }
}
