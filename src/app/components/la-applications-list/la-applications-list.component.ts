import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Optional, ViewChild} from '@angular/core';
import {Submission, SubmissionStatus, SubmissionType, SubmissionView} from '../../types/submission';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {LicenceService} from '../../services/licence.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {animations} from '../../animations';
import {Utils} from '../../services/utils.service';
import {User, UserView} from '../../types/user';
import {AuthenticationService} from '../../services/authentication.service';
import {ConfirmationInfo} from '../../types/dialog-info';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {Router} from '@angular/router';
import {UserGroup} from '../../types/ifisauthentication';

@Component({
  selector: 'app-la-applications-list',
  templateUrl: './la-applications-list.component.html',
  styleUrls: ['./la-applications-list.component.css'],
  animations: animations,
})
export class LaApplicationsListComponent implements OnInit, AfterViewInit {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );

  private pageSizeOptions: Array<number> = [5, 10, 20, 50];

  public dataSource: MatTableDataSource<SubmissionView>; // DMcD: public for testing
  public filterValue: string = null;

  public displayedColumns: Array<string> = ['createDate', 'type', 'refId', 'userId', 'vessel', 'status', 'updateDate', 'assignee', 'buttons'];
  public selectedSubmission: SubmissionView;

  // by default only get submissions in progress
  public loadAllSubmissions: boolean = false;

  // Progress and Error handling
  public isProcessing: boolean = false;
  public isLoading: boolean = true;
  public errorMessage: string = null;
  public loadingError: boolean = false;

  public paginator: MatPaginator; // DMcD: public for testing
  public sort: MatSort; // DMcD: public for testing
  public prevSortActive: string; // undefined
  public prevSortDirection: string = ''; // empty string

  public utils: Utils = Utils;
  public UserGroup: typeof UserGroup = UserGroup;

  public assignees: Array<User> = [];

  public selectedClient: UserView;

  // toggle buttons
  public clientToggleGroup: string = 'ALL_CLIENTS';
  @ViewChild('licenceToggle') public licenceToggle: ElementRef;
  @ViewChild('capacityToggle') public capacityToggle: ElementRef;
  @ViewChild('pendingToggle') public pendingToggle: ElementRef;
  @ViewChild('completedToggle') public completedToggle: ElementRef;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    /* istanbul ignore next */
    this.paginator = mp ? mp : this.paginator;
    this.setDataSourcePaginationAttributes();
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    /* istanbul ignore next */
    this.sort = ms ? ms : this.sort;
    this.setDataSourcePaginationAttributes();
  }

  constructor(private router: Router,
              public authentication: AuthenticationService,
              public dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private licenceService: LicenceService,
              @Optional() public cdRef: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource([]);
    this.selectedSubmission = null;

    this.assignees.push(new User({
      'id': 1,
      'firstName' : 'Emma',
      'lastName': 'Doyle',
      'lastLoginDate': ''
    }));
    this.assignees.push(new User({
      'id': 2,
      'firstName' : 'Paul',
      'lastName': 'Harris',
      'lastLoginDate': ''
    }));
    this.assignees.push(new User({
      'id': 3,
      'firstName' : 'Peter',
      'lastName': 'Harrington',
      'lastLoginDate': ''
    }));
    this.assignees.push(new User({
      'id': 4,
      'firstName' : 'John',
      'lastName': 'Murphy',
      'lastLoginDate': ''
    }));
    this.assignees.push(new User({
      'id': 5,
      'firstName' : 'Suzanna',
      'lastName': 'Lopez',
      'lastLoginDate': ''
    }));

  }

  ngOnInit(): void {
    this.selectedSubmission = null;
    this.getData();
    if (this.authentication.access.userGroup === UserGroup['REPRESENTATIVE']) {
      this.clientToggleGroup = 'SELECTED_CLIENT';
      this.displayedColumns = ['createDate', 'type', 'refId', 'userId', 'vessel', 'status', 'updateDate', 'buttons'];

      // TODO: remove this hard-coded client
      this.selectedClient = new UserView(
      {
        'id': 4,
        'firstName': 'Peter',
        'lastName': 'Mahoney',
        'userReferenceNumber': '44444',
        'lastLoginDate': '01/05/19 17:19'
      });
    } else {
      this.selectedClient = null;
      this.clientToggleGroup = 'ALL_CLIENTS';
      this.displayedColumns = ['createDate', 'type', 'refId', 'userId', 'vessel', 'status', 'updateDate', 'assignee', 'buttons'];
    }

  }

  ngAfterViewInit(): void {
    this.licenceToggle['checked'] = true;
    this.capacityToggle['checked'] = true;
    this.pendingToggle['checked'] = true;
    this.completedToggle['checked'] = false;

    this.cdRef.detectChanges();
  }

  public setDataSourcePaginationAttributes() {

    // Custom filter, allows searching on submission attributes. if submission attribute is matched the entire submission is returned.
    /*if (this.dataSource) {
      this.dataSource.filterPredicate = (data: SubmissionView, filter: string) => (
        data.refId.toString().indexOf(filter.toUpperCase()) >= 0
        || data.displayType().indexOf(filter.toUpperCase()) >= 0
        || data.applicants.filter( applicant => (applicant.firstName.toUpperCase().indexOf(filter) >= 0 || applicant.lastName.toUpperCase().indexOf(filter) >= 0)).length > 0
        || data.vessels.filter( vessel => vessel.name.toUpperCase().indexOf(filter) >= 0).length > 0
        || data.displayStatus().indexOf(filter.toUpperCase()) >= 0
        || data.applicationDate.toUpperCase().indexOf(filter.toUpperCase()) >= 0
        || data.updateDate.toUpperCase().indexOf(filter.toUpperCase()) >= 0
        || (data.assignee && data.assignee.firstName.toUpperCase().indexOf(filter.toUpperCase()) >= 0)
        || (data.assignee && data.assignee.lastName.toUpperCase().indexOf(filter.toUpperCase()) >= 0)
      );
    }
    */

    if (this.paginator) {
      let prevPageIndex: number = 0; // show first page by default
      let prevPageSize: number = 10; // show 10 rows by default
      if (this.dataSource.paginator) {
        prevPageIndex = this.dataSource.paginator.pageIndex !== prevPageIndex ? this.dataSource.paginator.pageIndex : prevPageIndex;
        prevPageSize = this.dataSource.paginator.pageSize !== prevPageSize ? this.dataSource.paginator.pageSize : prevPageSize;
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = prevPageIndex;
      this.dataSource.paginator.pageSize = prevPageSize;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    if (this.paginator && this.sort && this.sort.active && this.sort.direction && (this.sort.active !== this.prevSortActive || this.sort.direction !== this.prevSortDirection)) {
      this.applyFilter('');
    }

    if (this.dataSource.sort) {
      this.prevSortActive = this.dataSource.sort.active !== this.prevSortActive ? this.dataSource.sort.active : this.prevSortActive;
      this.prevSortDirection = this.dataSource.sort.direction !== this.prevSortDirection ? this.dataSource.sort.direction : this.prevSortDirection;
    }

    this.cdRef.detectChanges();
  }

  public onLoadData(): void {
    // toggle view all / in progress flag
    this.loadAllSubmissions = !this.loadAllSubmissions;
    this.getData();
  }

  public getData(): void {
    this.isLoading = true; // Display progress bar
    this.errorMessage = '';

    this.licenceService.getSubmissions(this.loadAllSubmissions).subscribe(
      (data: Array<SubmissionView>) => {
        this.dataSource.data = data; // = new MatTableDataSource(data);

        this.setDataSourcePaginationAttributes();

        // TODO: Remove next block which is only for demo purposes
        if (this.authentication.access.userGroup === UserGroup['REPRESENTATIVE']) {
          this.applyFilter('Mahoney');
        } else {
          this.applyFilter(''); // clear filter (if set)
        }

        this.isLoading = false; // Hide progress bar
      },
      error => {
        console.error(error);
        this.errorMessage = 'Sorry, something went wrong. Submissions could not be retrieved at this time.';
        this.isLoading = false; // Hide progress bar
      }
    );
  }

  public applyFilter(fv?: string): void {

    let filterValue: string = this.getFilters(); // fv

    this.dataSource.filter = filterValue.trim().toUpperCase();
    this.dataSource.filterPredicate = (data: SubmissionView, filter: string) => {
      if (this.clientToggleGroup === 'SELECTED_CLIENT' && this.selectedClient) {
        if (!data.applicants.filter( (user: UserView) => user.userReferenceNumber === this.selectedClient.userReferenceNumber).length) {
          return false;
        }
      }
      if (!this.licenceToggle['checked'] && data.type === SubmissionType['LICENCE_APPLICATION']) {
        return false;
      }
      if (!this.capacityToggle['checked'] && [SubmissionType['CAPACITY_TRADE'], SubmissionType['CAPACITY_SWAP']].includes(data.type)) {
        return false;
      }
      if (!this.pendingToggle['checked'] && data.status !== SubmissionStatus['COMPLETE']) {
        return false;
      }
      if (!this.completedToggle['checked'] && data.status === SubmissionStatus['COMPLETE']) {
        return false;
      }

      return this.applyCustomFilter(data, this.filterValue);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public applyCustomFilter(data: SubmissionView, filter: string, multiple: boolean = true): boolean {

    if (filter) {
      // multiple = true applies an OR operator to the filter, multiple = false applies an AND operator to the filter
      const arrayFilter: Array<string> = filter.split(/[,]+/);
      let filterCount: number = 0;
      let matchCount: number = 0;
      let test_result: boolean;

      arrayFilter.forEach((value: string) => {
        filterCount++;

        value = value.trim().toUpperCase();
        const filterSearch = new RegExp(value, 'g');
        const res = filterSearch.test(data.toString().toUpperCase());

        if (res) {
          matchCount++;
          test_result = true;
        }
      });

      if (multiple) {
        test_result = (matchCount > 0);
      } else {
        test_result = (filterCount === matchCount);
      }

      return test_result;
    } else {
      return true;
    }
  }

  public getFilters(): string {
    const filterArray: Array<string> = [];
    if (this.licenceToggle['checked']) {
      filterArray.push('Licence');
    }
    if (this.capacityToggle['checked']) {
      filterArray.push('Capacity');
    }
    if (this.pendingToggle['checked']) {
      filterArray.push('Pending');
    }
    if (this.completedToggle['checked']) {
      filterArray.push('Completed');
    }
    if (this.filterValue) {
      filterArray.push(this.filterValue);
    }

    return filterArray.length > 0 ? filterArray.toString() : '';
  }


  public displaySubmission(submission: SubmissionView, index: number): void {

    // Display Client Selector warning message
    // TODO: Replace this hard coded demo implementation
    if (this.authentication.access.userGroup === UserGroup['REPRESENTATIVE']
      && submission.applicants.filter( applicant => applicant.firstName === 'Peter' && applicant.lastName === 'Mahoney').length === 0) {
      this.confirmClientSelection(submission).subscribe((selectionConfirmed: boolean) => {
        if (selectionConfirmed) {
          this.selectedSubmission = submission;
        }
      });
    } else {
      this.selectedSubmission = submission;
    }

  }

  public selectAssignee(submission: SubmissionView, index: number): void {
    submission.assignInProgress = true;
  }

  public assignSubmission(submission: SubmissionView, index: number, assignee: User): void {
    // submission.assignee = new User(assignee); // doesn't update the onscreen list
    this.dataSource.data[index].assignee = assignee; // index is undefined
    this.dataSource.data[index].assignInProgress = false;
  }

  /* istanbul ignore next */
  public sortData(sort: Sort) {
  }

  /*
  public sortData(sort: Sort) {
    const data = this.desserts.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'calories': return compare(a.calories, b.calories, isAsc);
        case 'fat': return compare(a.fat, b.fat, isAsc);
        case 'carbs': return compare(a.carbs, b.carbs, isAsc);
        case 'protein': return compare(a.protein, b.protein, isAsc);
        default: return 0;
      }
    });
  }
  */

  public confirmClientSelection(submission: SubmissionView): Observable<boolean> {
    return new Observable(observer => {

      // TODO: remove this hardcoding
      /*
      let text: string =
        `In selecting this application you will be acting on behalf of <br><br>
      ${submission.applicants[0].firstName} ${submission.applicants[0].lastName}.`;
       */
      const text: string = 'In selecting this application you will be acting on behalf of';
      const prompt: string = `${submission.applicants[0].firstName} ${submission.applicants[0].lastName}`;

      const confirmationInfo: ConfirmationInfo = new ConfirmationInfo('Confirm Representation', text, prompt, 'OK', 'CANCEL');

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: confirmationInfo
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Confirmation result: ${result}`);
        observer.next(result ? true : false);
        observer.complete();
      });

    });
  }

  public confirmStartNewApplication(): Observable<boolean> {
    return new Observable(observer => {

      if (!this.selectedClient) {

      } else {
        const text: string = 'You are about to start a new application on behalf of';
        const prompt: string = `${this.selectedClient.firstName} ${this.selectedClient.lastName}`;

        const confirmationInfo: ConfirmationInfo = new ConfirmationInfo('Confirm Representation', text, prompt, 'OK', 'CANCEL');

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '300px',
          data: confirmationInfo
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Confirmation result: ${result}`);
          observer.next(result ? true : false);
          observer.complete();
        });
      }
    });
  }

  public onNewApplication(): void {
    if (this.authentication.access.userGroup === UserGroup['REPRESENTATIVE']) {
      this.confirmStartNewApplication().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.router.navigate(['/licence-application']).then((e) => {});
        } else {
          return; // abort
        }
      });
    } else {
      this.router.navigate(['/licence-application']).then((e) => {});
    }
  }

}
