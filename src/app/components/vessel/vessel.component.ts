import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VesselView } from 'src/app/types/vessel';
import { VesselCardInfo } from 'src/app/types/vesselCardInfo';
import { animations } from '../../animations';
import { Globals } from '../../globals';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.css'],
  animations: animations,
})
export class VesselComponent implements OnInit {

  @Input() public vessel: VesselView;
  @Input() public vCardInfo: VesselCardInfo;
  @Input() public notificationBadge: string = null;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall)
  .pipe(
    map((result) => result.matches),
  );

  public display: string = 'IMAGE'; // IMAGE | LOCATION (by default show vessel image)
  public showAllAdditionalVessionDetails: boolean = false;

  constructor(public globals: Globals,
              private breakpointObserver: BreakpointObserver,
              private _bottomSheet: MatBottomSheet) { }

  public ngOnInit(): void { }

  public openBottomSheet(): void {
    this._bottomSheet.open(GlossaryVesselIdentifiersBottomSheet);
  }
}

@Component({
  selector: 'app-glossary-vessel-identifiers',
  templateUrl: '../glossary/glossary-vessel-identifiers.html',
})
export class GlossaryVesselIdentifiersBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<GlossaryVesselIdentifiersBottomSheet>) {}

  public openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
