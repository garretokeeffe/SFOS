import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UserView } from '../../../types/user';
import { LicenceApplicationView } from '../../../types/licence-application';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { animations } from '../../../animations';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-la-confirm-qualifying-status',
  templateUrl: './la-confirm-qualifying-status.component.html',
  styleUrls: ['./la-confirm-qualifying-status.component.css'],
  animations: animations,
})
export class LaConfirmQualifyingStatusComponent implements OnInit {

  @Input() public standAlonePage: boolean = false;
  @Input() public user: UserView = null;
  @Input() public licenceApplication: LicenceApplicationView = new LicenceApplicationView();

  @Output() public back: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public next: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();

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

  public isQualified: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver,
              private _bottomSheet: MatBottomSheet,
              @Optional() public cdRef: ChangeDetectorRef) {  }

  public ngOnInit(): void { }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public openQualifyingStatusBottomSheet(): void {
    this._bottomSheet.open(LaConfirmQualifyingStatusBottomSheet);
  }
  public openProcessExplanationBottomSheet(): void {
    this._bottomSheet.open(LaLicenceApplicationProcessExplanationBottomSheet);
  }
}

@Component({
  selector: 'app-la-process-explanation-bottomsheet',
  templateUrl: 'la-process-explanation.bottomsheet.html',
})
export class LaLicenceApplicationProcessExplanationBottomSheet {
  constructor(private breakpointObserver: BreakpointObserver,
              private _bottomSheetRef: MatBottomSheetRef<LaLicenceApplicationProcessExplanationBottomSheet>) {}

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

@Component({
  selector: 'app-la-confirm-qualifying-status-bottomsheet',
  templateUrl: 'la-confirm-qualifying-status.bottomsheet.html',
})
export class LaConfirmQualifyingStatusBottomSheet {
  constructor(private breakpointObserver: BreakpointObserver,
              private _bottomSheetRef: MatBottomSheetRef<LaConfirmQualifyingStatusBottomSheet>) {}

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
