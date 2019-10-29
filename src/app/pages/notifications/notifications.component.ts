import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Optional, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {SubmissionStatus, SubmissionType, SubmissionView} from '../../types/submission';
import {Utils} from '../../services/utils.service';
import {UserGroup} from '../../types/ifisauthentication';
import {User, UserView} from '../../types/user';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {LicenceService} from '../../services/licence.service';
import {ConfirmationInfo} from '../../types/dialog-info';
import {ConfirmationDialogComponent} from '../../components/confirmation-dialog/confirmation-dialog.component';
import {FormControl} from '@angular/forms';
import {SegmentGroup} from '../../components/licence-application/la-preliminary-info0/la-preliminary-info-component0.component';
import {NotificationCategory, NotificationCategoryView, NotificationView} from '../../types/notification';
import {animations} from '../../animations';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: animations,
})
export class NotificationsComponent implements OnInit, AfterViewInit {

  /*
  public categoryControl: FormControl = new FormControl();
  public categories: NotificationCategory[] = [
    {
      id: 1,
      name: 'LICENCE',
    },
    {
      id: 2,
      name: 'VESSEL',
    },
    {
      id: 3,
      name: 'AUTHORISATIONS',
    },
    {
      id: 4,
      name: 'NONE',
    },
  ];
   */

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );

  private pageSizeOptions: Array<number> = [5, 10, 20, 50];

  public notifications: Array<NotificationView> = [];
  public dataSource: MatTableDataSource<NotificationView>; // DMcD: public for testing
  public displayedDataSource: MatTableDataSource<NotificationView>; // DMcD: public for testing
  public notificationCategories: Array<NotificationCategory> = [];

  public filterValue: string = null;

  public displayedColumns: Array<string> = ['date', 'category', 'vesselName', 'text', 'actionRequired'];
  public selectedSubmission: SubmissionView;
  public selectedNotificationCategory: number = -1;

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

  public selectedClient: UserView;

  // toggle buttons
  public clientToggleGroup: string = 'ALL_CLIENTS';
  @ViewChild('licenceToggle') public licenceToggle: ElementRef;
  @ViewChild('capacityToggle') public capacityToggle: ElementRef;
  @ViewChild('unreadToggle') public unreadToggle: ElementRef;
  @ViewChild('readToggle') public readToggle: ElementRef;

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
              private notificationService: NotificationService,
              @Optional() public cdRef: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource([]);
    this.displayedDataSource = new MatTableDataSource([]);
    this.selectedSubmission = null;
  }

  public ngOnInit(): void {
    this.getData();
  }

  public ngAfterViewInit(): void {
    this.unreadToggle['checked'] = true;
    this.readToggle['checked'] = false;

    this.cdRef.detectChanges();
  }

  public setDataSourcePaginationAttributes(): void {

    // Custom filter, allows searching on submission attributes. if submission attribute is matched the entire submission is returned.
    /*if (this.dataSource) {
      this.dataSource.filterPredicate = (data: SubmissionView, filter: string) => (
        data.refId.toString().indexOf(filter.toUpperCase()) >= 0
        || data.displayType().indexOf(filter.toUpperCase()) >= 0
        || data.applicants.filter( applicant => (applicant.firstName.toUpperCase().indexOf(filter) >= 0 || applicant.lastName.toUpperCase().indexOf(filter) >= 0)).length > 0
        || data.vessels.filter( vessel => vessel.name.toUpperCase().indexOf(filter) >= 0).length > 0
        || data.displayStatus().indexOf(filter.toUpperCase()) >= 0
        || data.createDate.toUpperCase().indexOf(filter.toUpperCase()) >= 0
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

  public getData(): void {
    this.isLoading = true; // Display progress bar
    this.errorMessage = '';

    this.notificationService.getNotifications().subscribe(
(data: Array<NotificationView>) => {
        this.notifications = data;
        this.dataSource.data = data; // = new MatTableDataSource(data);
        this.setDataSourcePaginationAttributes();

        this.notificationService.getNotificationCategories().subscribe(
          (categories: Array<NotificationCategoryView>) => {
            this.notificationCategories = categories;
            this.isLoading = false; // Hide progress bar
          },
          (error) => {
            console.error('Failed to load notification categories');
            console.error(error);
            this.isLoading = false; // Hide progress bar
          },
        );
      },
(error) => {
        console.error(error);
        this.errorMessage = 'Sorry, something went wrong. Notifications could not be retrieved at this time.';
        this.isLoading = false; // Hide progress bar
      },
    );
  }

  public categoryChanged(value: number): void {

    this.dataSource.data = this.selectedNotificationCategory === -1 ? this.notifications : this.notifications.filter(
      (elem: NotificationView) => elem.categoryId === this.selectedNotificationCategory);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public applyFilter(fv?: string): void {

    this.dataSource.filter = this.filterValue.trim().toUpperCase();
    this.dataSource.filterPredicate = (data: NotificationView, filter: string) => {

      /*
      if (this.unreadToggle['checked'] && !data.readByUser) {
        return false;
      }
      if (this.readToggle['checked'] && data.readByUser) {
        return false;
      }
      */
      return this.applyCustomFilter(data, this.filterValue);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public applyCustomFilter(data: NotificationView, filter: string, multiple: boolean = false): boolean {

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

  public displayCategoryName(categoryId: number): string | number {
    let category: NotificationCategoryView = this.notificationCategories.filter( (elem: NotificationCategoryView) => elem.id === categoryId)[0];
    if (category) {
      return category.name;
    } else {
      return categoryId;
    }
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

}
