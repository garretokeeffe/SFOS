import { Component, Input, OnInit } from '@angular/core';
import { CapacityBlock } from '../../../types/capacity';
import { PenaltyPoints } from '../../../types/points';
import { Duration } from 'moment';
import { Globals } from '../../../globals';
import * as moment from 'moment';

@Component({
  selector: 'app-capacity-block',
  templateUrl: './capacity-block.component.html',
  styleUrls: ['./capacity-block.component.css'],
})
export class CapacityBlockComponent implements OnInit {

  @Input() public block: CapacityBlock = null;
  @Input() public showQuotaEligibility: boolean = false;
  @Input() public pointsEnabled: boolean = false;
  @Input() public innerCard: boolean = false; /* for styling */

  constructor(private globals: Globals) { }

  public ngOnInit(): void {
  }

  public getTotalPenaltyPoints(): number {
    let total: number = 0;
    this.block.penaltyPoints.forEach( (penaltyPoints: PenaltyPoints ) => {
      total = total + penaltyPoints.numberOfPoints;
    });
    return total;
  }

  public isExpiringSoon(): boolean {
    let expiringSoon: boolean = false;
    if (this.block && this.block.expiryDate) {

      const now: any = moment.utc(new Date()); // today's date
      const expiryDate: any = moment(this.block.expiryDate, 'DD/MM/YYYY'); // expiryDate should already be in utc
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
