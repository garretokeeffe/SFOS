import { Component, Input, OnInit } from '@angular/core';
import { CapacityView } from '../../../types/capacity';
import { animation } from '@angular/animations';
import { animations } from '../../../animations';
import { TrackRecord } from '../../../types/trackRecord';

@Component({
  selector: 'app-track-record',
  templateUrl: './track-record.component.html',
  styleUrls: ['./track-record.component.css'],
  animations: animations,
})
export class TrackRecordComponent implements OnInit {

  @Input() public capacity: CapacityView = null;

  public showQuotaEligibility: boolean = false;

  constructor() { }

  public ngOnInit(): void {
    // TODO: this should really be in an ngOnChange handler
    this.showQuotaEligibility = this.capacity.hasQuotaEligibility();
  }

}
