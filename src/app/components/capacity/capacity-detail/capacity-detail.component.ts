import { Component, Input, OnInit } from '@angular/core';
import { CapacityDetail } from '../../../types/capacity';
import { PenaltyPoints } from '../../../types/points';
import * as moment from 'moment';
import { Duration } from 'moment';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-capacity-detail',
  templateUrl: './capacity-detail.component.html',
  styleUrls: ['./capacity-detail.component.css']
})
export class CapacityDetailComponent implements OnInit {

  @Input() public detail: CapacityDetail = null;
  @Input() public showQuotaEligibility: boolean = false;
  @Input() public pointsEnabled: boolean = false;
  @Input() public innerCard: boolean = false; /* for styling */

  constructor(private globals: Globals) { }

  public ngOnInit(): void {
  }

  public getTotalPenaltyPoints(): number {
    let total: number = 0;
    this.detail.penaltyPoints.forEach( (penaltyPoints: PenaltyPoints ) => {
      total = total + penaltyPoints.numberOfPoints;
    });
    return total;
  }

  public isExpiringSoon(): boolean {
    let expiringSoon: boolean = false;
    if (this.detail && this.detail.expiryDate) {

      const now: any = moment.utc(new Date()); // today's date
      const expiryDate: any = moment(this.detail.expiryDate, 'DD/MM/YYYY'); // expiryDate should already be in utc
      const difference: Duration = moment.duration(expiryDate.diff(now));
      const daysToExpiry: number = difference.asDays();
      // console.log('Days to expiry: ' + daysToExpiry);

      if (daysToExpiry <= this.globals.configuration.warnIfCapacityExpiryDateIsApproachingDays) {
        expiringSoon = true;
      }
    }
    return expiringSoon;
  }
}
