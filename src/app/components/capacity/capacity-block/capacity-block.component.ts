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
}
