import {
  AfterViewChecked,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CapacityView } from '../../types/capacity';
import { CapacityManager } from './capacity-manager.component';
import { FleetSegment, FleetSubSegment } from '../../types/fleet-segment';
import { animations } from '../../animations';

@Component({
  selector: 'app-capacity-fleet-subsegment-table',
  animations: animations,
  template: `    
    <div *ngIf="capacities.length" class="padding-horizontal padding-bottom margin-bottom">
      <div *ngIf="capacities[0].fleetSubSegment !== FleetSubSegment['NONE']"
           class="wizard-label margin-top color-primary" [class.margin-bottom]="!pointsEnabled || displayMode === 'GRID'">
        {{ (capacities[0]).displayFleetSubSegment() }}
        <span *ngIf="offRegisterProposed" class="error">&nbsp;*** PROPOSED ***</span>
        <span *ngIf="showSubSegmentTotal" class="color-primary-soft margin-left" style="text-transform: none">{{ CapacityManager.getTotalCapacity(capacities) }}</span>
      </div>
    
      <div *ngIf="capacities[0].fleetSubSegment === FleetSubSegment['NONE']"class="margin-bottom"></div>
      
      <table *ngIf="displayMode === 'TABLE'" mat-table [dataSource]="capacities">
        <ng-container matColumnDef="vesselIcon">
          <th mat-header-cell *matHeaderCellDef class="color-primary"></th>
          <td mat-cell *matCellDef="let capacity" class="vesselIconColumn">
            <mat-icon>directions_boat</mat-icon>
          </td>
        </ng-container>
        <ng-container matColumnDef="vesselName">
          <th mat-header-cell *matHeaderCellDef class="color-primary">Vessel</th>
          <td mat-cell *matCellDef="let capacity" [class.alignCols]="alignColumns" [class.pointsEnabled]="pointsEnabled">
            <div fxLayout="start center" fxLayoutGap="16px">
              <mat-icon *ngIf="!pointsEnabled">directions_boat</mat-icon>
              <div fxFlexAlign="center" >{{ capacity.vessel.name }}</div>
            </div>
          </td>
        </ng-container>
        <ng-container matColumnDef="vesselNameOffRegister">
          <th mat-header-cell *matHeaderCellDef class="color-primary">Vessel</th>
          <td mat-cell *matCellDef="let capacity" [class.alignCols]="alignColumns" [class.pointsEnabled]="pointsEnabled">
            {{ capacity.vessel.name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="sourceVesselName">
          <th mat-header-cell *matHeaderCellDef class="color-primary">Source Vessel</th>
          <td mat-cell *matCellDef="let capacity" [class.alignCols]="alignColumns" [class.pointsEnabled]="pointsEnabled">
            {{ capacity.vessel.name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="targetVesselName">
          <th mat-header-cell *matHeaderCellDef class="color-primary">Target Vessel</th>
          <td mat-cell *matCellDef="let capacity" [class.alignCols]="alignColumns" [class.pointsEnabled]="pointsEnabled">
            {{ capacity.vessel.name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="capacity">
          <th mat-header-cell *matHeaderCellDef class="color-primary">My Capacity</th>
          <td mat-cell *matCellDef="let capacity">{{ capacity.gt }}&nbsp;GT {{ capacity.kw }}&nbsp;kW</td>
        </ng-container>
        <ng-container matColumnDef="vesselCapacity">
          <th mat-header-cell *matHeaderCellDef class="color-primary"><span *ngIf="offRegisterProposed">Target </span>Vessel Capacity</th>
          <td mat-cell *matCellDef="let capacity">{{ capacity.vessel.gt }}&nbsp;GT {{ capacity.vessel.kw }}&nbsp;kW</td>
        </ng-container>
        <ng-container matColumnDef="offRegisterDate">
          <th mat-header-cell *matHeaderCellDef class="color-primary" class="centered-content">Off Register Since</th>
          <td mat-cell *matCellDef="let capacity" class="centered-content">01/01/2019</td> <!-- {{ capacity.offRegisterDate || '-'}} -->
        </ng-container>
        <ng-container matColumnDef="capacityExpiryDate">
          <th mat-header-cell *matHeaderCellDef class="color-primary" class="centered-content">Capacity Expires</th>
          <td mat-cell *matCellDef="let capacity" class="centered-content">31/12/2020</td><!-- {{ capacity.offRegisterExpiryDate || '-'}} -->
        </ng-container>
        <ng-container matColumnDef="points">
          <th mat-header-cell *matHeaderCellDef class="color-primary" class="centered-content">Points</th>
          <td mat-cell *matCellDef="let capacity" class="centered-content">
            <div *ngIf="!capacity.penaltyPoints || !capacity.penaltyPoints.length">0</div>
            <div *ngFor="let penaltyPoints of capacity.penaltyPoints">
              {{ penaltyPoints.pointsAssigned || '0' }}
            </div>
          </td>
        </ng-container>
        <ng-container matColumnDef="pointsExpiryDate">
          <th mat-header-cell *matHeaderCellDef class="color-primary" class="centered-content">Points Expire</th>
          <td mat-cell *matCellDef="let capacity" class="centered-content">
            <div *ngIf="!capacity.penaltyPoints || !capacity.penaltyPoints.length">-</div>
            <div *ngFor="let penaltyPoints of capacity.penaltyPoints;">
              {{ penaltyPoints.expiryDate || '-' }}
            </div>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="fleetSubSegmentColumns" [class.hidden]="!pointsEnabled &&!showVesselCapacity && (!offRegister && !offRegisterProposed)"></tr>
        <tr mat-row *matRowDef="let row; columns: fleetSubSegmentColumns;"></tr>
      </table>
    
      <div *ngIf="displayMode === 'GRID'">
          <div fxLayout="(isHandset$ | async) ? 'row' : 'column'"  fxLayoutAlign="start stretch" fxLayoutGap="16px" class="mat-card-group">
            <div *ngFor="let capacity of capacities; let i = index;" [class.fullWidth]="(isHandset$ | async)">
              <mat-card #card class="margin-bottom" [@fadeInOut]="'fadeIn'">
                <mat-card-header>
                  <mat-card-title>
                    <div *ngIf="!offRegisterProposed">
                      <div fxFill fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="16px">
                        <mat-icon>directions_boat</mat-icon>
                        <div>{{ capacity.vessel.name }}</div>
                      </div>
                    </div>
                    <div *ngIf="offRegisterProposed" fxFill fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px">
                      <mat-icon>directions_boat</mat-icon>
                      <div fxFlexAlign="center">
                        <div class="text-small card-data-header">Source Vessel</div>
                        <div>{{ capacity.vessel.name }}</div>
                      </div>
                    </div>
                    <div *ngIf="offRegisterProposed" fxFill fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px" class="margin-top-half">
                      <mat-icon>subdirectory_arrow_right</mat-icon>
                      <div fxFlexAlign="center">
                        <div class="text-small card-data-header">Target Vessel</div>
                        <div>Star of the Sea</div>
                      </div>
                    </div>
                  </mat-card-title>
                  <mat-card-subtitle></mat-card-subtitle>
                </mat-card-header>

                <mat-card-content>
                  <div fxFill fxLayout="row" fxLayoutAlign="center start" fxLayoutGap="16px" class="margin-top-double">
                    <div>
                      <div class="text-small card-data-header">My&nbsp;Capacity</div>
                      <div class="card-data centered-content">{{ capacity.gt }}&nbsp;GT {{ capacity.kw }}&nbsp;kW</div>
                    </div>
                    <div *ngIf="showVesselCapacity">
                      <div class="text-small card-data-header"><span *ngIf="offRegisterProposed">Target&nbsp;</span>Vessel&nbsp;Capacity</div>
                      <div class="card-data centered-content">{{ capacity.vessel.gt }}&nbsp;GT {{ capacity.vessel.kw }}&nbsp;kW</div>
                    </div>
                    <div *ngIf="pointsEnabled && !(isHandset$ | async)" class="left">
                      <div class="text-small card-data-header">Points</div>
                      <div *ngIf="!capacity.penaltyPoints || !capacity.penaltyPoints.length" class="card-data centered-content">0</div>
                      <div *ngFor="let penaltyPoints of capacity.penaltyPoints" class="card-data centered-content">{{ penaltyPoints.pointsAssigned }}</div>
                      <div *ngIf="capacity.penaltyPoints && capacity.penaltyPoints.length > 1" class="card-data centered-content border-top">
                        {{ capacity.getTotalPenaltyPoints() }}
                      </div>
                    </div>
                    <div *ngIf="pointsEnabled && !(isHandset$ | async)" class="left">
                      <div class="text-small card-data-header">Points&nbsp;Expire</div>
                      <div *ngIf="!capacity.penaltyPoints || !capacity.penaltyPoints.length" class="card-data centered-content">-</div>
                      <div *ngFor="let penaltyPoints of capacity.penaltyPoints" class="card-data centered-content">{{ penaltyPoints.expiryDate || '-' }}</div>
                    </div>
                  </div>
                  <div *ngIf="pointsEnabled && (isHandset$ | async)" fxFill fxLayout="row" fxLayoutAlign="center start" fxLayoutGap="16px" class="margin-top">
                    <div class="left">
                      <div class="text-small card-data-header">Points</div>
                      <div *ngIf="!capacity.penaltyPoints || !capacity.penaltyPoints.length" class="card-data centered-content">0</div>
                      <div *ngFor="let penaltyPoints of capacity.penaltyPoints" class="card-data centered-content">{{ penaltyPoints.pointsAssigned }}</div>
                      <div *ngIf="capacity.penaltyPoints && capacity.penaltyPoints.length > 1" class="card-data centered-content border-top">
                        {{ capacity.getTotalPenaltyPoints() }}
                      </div>
                    </div>
                    <div class="left">
                      <div class="text-small card-data-header">Points&nbsp;Expire</div>
                      <div *ngIf="!capacity.penaltyPoints || !capacity.penaltyPoints.length" class="card-data centered-content">-</div>
                      <div *ngFor="let penaltyPoints of capacity.penaltyPoints" class="card-data centered-content">{{ penaltyPoints.expiryDate || '-' }}</div>
                    </div>
                  </div>
                  <div *ngIf="offRegister || offRegisterProposed" fxFill fxLayout="row" fxLayoutAlign="center start" fxLayoutGap="16px" class="margin-top">
                    <div fxFlexAlign="start">
                      <div class="text-small card-data-header">Off Register Since</div>
                      <div class="card-data centered-content">01/01/2019</div> <!-- {{ capacity.offRegisterDate || '-' }} -->
                    </div>
                    <div class="left">
                      <div class="text-small card-data-header">Capacity Expires</div>
                      <div class="card-data centered-content">31/12/2020</div><!-- {{ capacity.offRegisterExpiryDate || '-' }} -->
                    </div>
                  </div>
                  <div *ngIf="capacity.trackRecord && capacity.trackRecord.type && displayTrackRecord" fxFill fxLayout="column" fxLayoutAlign="center start" class="margin-top">
                    <div class="text-small card-data-header centered-content">Track Record</div>
                    <div class="card-data centered-content">
                      {{ capacity.trackRecord.displayType() }} 
                      {{ capacity.trackRecord.quotaEligibility ? 'WITH' : 'WITHOUT' }} 
                      Quota Eligibility
                    </div>
                  </div>
                  
                  <!-- &#10004; = Tick,  &#10006; = X -->
                  <!--
                  <div *ngIf="showAllTrackRecord" class="text-small card-data-header centered-content margin-top">Track Record</div>
                  <div *ngIf="showAllTrackRecord" fxFill fxLayout="row" fxLayoutAlign="space-around start" fxLayoutGap="16px">
                    <div class="centered-content">
                      <div class="text-small card-data-header" title="Tier 1 Mackeral">T1 MAC</div>
                      <div class="card-data">&#10004;</div>
                    </div>
                    <div class="centered-content">
                      <div class="text-small card-data-header" title="Tier 2 Mackeral">T2 MAC</div>
                      <div class="card-data">-</div>
                    </div>
                    <div class="centered-content">
                      <div class="text-small card-data-header" title="Celtic Sea Herring">CS HER</div>
                      <div class="card-data">&#10004;&nbsp;QE</div>
                    </div>
                    <div class="centered-content">
                      <div class="text-small card-data-header" title="North West Herring">NW HER</div>
                      <div class="card-data">&#10006;</div>
                    </div>
                    <div class="centered-content">
                      <div class="text-small card-data-header" title="White Fish">WF</div>
                      <div class="card-data">-</div>
                    </div>
                  </div>
                  -->
                  
                </mat-card-content>
                
              </mat-card>
              
            </div>
          </div>
      </div>
      
    </div>
    `,
  styleUrls: ['./capacity.component.css']
})
export class CapacityFleetSubSegmentComponent implements OnChanges {

  @Input() public capacities: Array<CapacityView> = [];
  @Input() public showSubSegmentTotal: boolean = false;
  @Input() public pointsEnabled: boolean = false;
  @Input() public showVesselCapacity: boolean = false;
  @Input() public alignColumns: boolean = false;
  @Input() public displayMode: string = 'TABLE';
  @Input() public offRegister: boolean = false;
  @Input() public offRegisterProposed: boolean = false;
  @Input() public offRegisterAssigned: boolean = false;

  private displayTrackRecord: boolean = false; // remove this flag when track record is implemented

  public CapacityManager: CapacityManager = new CapacityManager(); // static reference

  private capacitiesDisplayed: Array<CapacityView> = []; // TODO: this can be removed after UI has been agreed

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  public fleetSubSegmentColumns: Array<string> = []; // ['vesselIcon', 'vesselName', 'capacity']; // 'points', 'pointsExpiryDate'
  public FleetSubSegment: any = FleetSubSegment; // enum reference

  constructor(public breakpointObserver: BreakpointObserver) { }

  // TODO: this method can be removed after a UI has been agreed
  public ngOnChanges(changes: SimpleChanges): void {
    const columns: Array<string> = [];
    if (this.offRegister) {
      columns.push('vesselNameOffRegister');
      columns.push('capacity');
      if (this.showVesselCapacity) {
        columns.push('vesselCapacity');
      }
      columns.push('offRegisterDate');
      columns.push('capacityExpiryDate');
      if (this.pointsEnabled) {
        columns.push('points');
        columns.push('pointsExpiryDate');
      }
      // this.fleetSubSegmentColumns = this.pointsEnabled
      //                             ? ['vesselNameOffRegister', 'capacity', 'offRegisterDate', 'capacityExpiryDate', 'points', 'pointsExpiryDate']
      //                             : ['vesselNameOffRegister', 'capacity', 'offRegisterDate', 'capacityExpiryDate'];
    } else if (this.offRegisterProposed) {
      columns.push('sourceVesselName');
      columns.push('targetVesselName');
      columns.push('capacity');
      if (this.showVesselCapacity) {
        columns.push('vesselCapacity');
      }
      columns.push('offRegisterDate');
      columns.push('capacityExpiryDate');
      if (this.pointsEnabled) {
        columns.push('points');
        columns.push('pointsExpiryDate');
      }
      // this.fleetSubSegmentColumns = this.pointsEnabled
      //                             ? ['sourceVesselName', 'targetVesselName', 'capacity', 'offRegisterDate', 'capacityExpiryDate', 'points', 'pointsExpiryDate']
      //                             : ['sourceVesselName', 'targetVesselName', 'capacity', 'offRegisterDate', 'capacityExpiryDate'];
    } else {
      // On Register
      columns.push('vesselName');
      columns.push('capacity');
      if (this.showVesselCapacity) {
        columns.push('vesselCapacity');
      }
      if (this.pointsEnabled) {
        columns.push('points');
        columns.push('pointsExpiryDate');
      }
    }
    this.fleetSubSegmentColumns = columns;
  }

}
