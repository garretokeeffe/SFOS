import {AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LicenceApplicationView} from '../../../types/licence-application';
import {MatDialog, MatTable, MatTableDataSource} from '@angular/material';
import {Applicant, ApplicantView} from '../../../types/applicant';
import {animations} from '../../../animations';
import {UserService} from '../../../services/user.service';
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
  selector: 'app-la-preliminary-info',
  templateUrl: './la-preliminary-info.component.html',
  styleUrls: ['./la-preliminary-info.component.css'],
  animations: animations
})
export class LaPreliminaryInfoComponent implements OnInit, AfterViewChecked {

  @Input() licenceApplication: LicenceApplicationView;
  @ViewChild(MatTable) applicantTable: MatTable<ApplicantView>;

  public dataSource: MatTableDataSource<ApplicantView>; // DMcD: public for testing
  public displayedColumns: Array<string> = ['name', 'numberOfShares', 'commands'];

  segmentControl = new FormControl();
  segmentGroups: SegmentGroup[] = [
    {
      name: 'RSW Pelagic',
      segment: [
        {value: 'rsw-pelagic', viewValue: 'RSW Pelagic'}
      ]
    },
    {
      name: 'Beam Trawler',
      segment: [
        {value: 'beam-trawler', viewValue: 'Beam Trawler'}
      ]
    },
    {
      name: 'Aquaculture',
      segment: [
        {value: 'aquaculture', viewValue: 'Aquaculture'}
      ]
    },
    {
      name: 'Polyvalent',
      disabled: false,
      segment: [
        {value: 'polyvalent-lt-18', viewValue: 'Polyvalent < 18m LOA'},
        {value: 'polyvalent-gte-18', viewValue: 'Polyvalent >= 18m LOA'},
        {value: 'polyvalent-scallops', viewValue: 'Polyvalent Scallops'}
      ]
    },
    {
      name: 'Specific',
      segment: [
        {value: 'specific-scallops-gte-10', viewValue: 'Specific Scallops >= 10m LOA'},
        {value: 'specific-general', viewValue: 'Specific General'},
      ]
    }
  ];
  loaControl = new FormControl();
  loas: OptionItem[] = [
    {value: 'gte_24', viewValue: 'LOA >= 24m'},
    {value: 'gte_15_lt_24', viewValue: 'LOA >= 15m && < 24m'},
    {value: 'lt_15', viewValue: 'LOA < 15m'},
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              public userService: UserService) { }

  ngOnInit() {
    // this.dataSource.data = this.licenceApplication.applicants;
    this.licenceApplication.applicants.forEach((applicant: ApplicantView) => {
      console.log(applicant.fullName);
    });
  }

  ngAfterViewChecked() {
    // *ngIf="this.licenceApplication.applicants.length > 0"
    this.applicantTable.renderRows();
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
        // this.licenceApplication.applicants[index] = new ApplicantView(user);
        this.licenceApplication.applicants[index].id = user.id;
        this.licenceApplication.applicants[index].userReferenceNumber = user.userReferenceNumber;
        this.licenceApplication.applicants[index].firstName = user.firstName;
        this.licenceApplication.applicants[index].surname = user.surname;
        this.licenceApplication.applicants[index].email = user.email;
        this.licenceApplication.applicants[index].numberOfShares = 0;
        this.licenceApplication.applicants[index].notFound = false;

        this.applicantTable.renderRows();
      } else {
        this.licenceApplication.applicants[index].notFound = true;
      }
    },
    error => {
      console.error('Failed to retrieve user by user ref no');
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
      data: applicant.popupInfo()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The applicant info dialog was closed');
    });
  }
}
